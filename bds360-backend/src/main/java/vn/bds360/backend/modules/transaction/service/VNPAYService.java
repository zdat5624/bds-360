package vn.bds360.backend.modules.transaction.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.exception.AppException;
import vn.bds360.backend.common.exception.ErrorCode;
import vn.bds360.backend.modules.email.service.EmailService;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.transaction.config.VnPayProperties;
import vn.bds360.backend.modules.transaction.dto.response.PaymentLinkResponse;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.transaction.util.VnPayUtil;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.security.SecurityUtil;

@Slf4j // Khuyến nghị dùng Log thay vì System.out
@Service
@RequiredArgsConstructor
public class VNPAYService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final VnPayProperties vnPayProperties;

    // ==========================================
    // 1. TẠO LINK THANH TOÁN
    // ==========================================
    public PaymentLinkResponse createVNPayLink(long inputAmount, String ipAdress) {
        long amount = inputAmount * 100;

        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String vnp_TxnRef = VnPayUtil.getRandomNumber(10);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayProperties.getVersion());
        vnp_Params.put("vnp_Command", vnPayProperties.getCommand());
        vnp_Params.put("vnp_TmnCode", vnPayProperties.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan giao dich nap tien ID: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayProperties.getReturnUrlBackend());
        vnp_Params.put("vnp_IpAddr", ipAdress);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayUtil.hmacSHA512(vnPayProperties.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayProperties.getPayUrl() + "?" + queryUrl;

        // Lưu Database
        Transaction transaction = new Transaction();
        transaction.setAmount(inputAmount);
        transaction.setStatus(TransStatusEnum.PENDING);
        transaction.setDescription("Giao dịch nạp tiền đang chờ thanh toán");
        transaction.setUser(user);
        transaction.setPaymentLink(paymentUrl);
        transaction.setTxnId(vnp_TxnRef);
        transactionRepository.save(transaction);

        PaymentLinkResponse res = new PaymentLinkResponse();
        res.setPaymentLink(paymentUrl);
        return res;
    }

    // ==========================================
    // 2. XỬ LÝ KẾT QUẢ TRẢ VỀ TỪ VNPAY
    // ==========================================
    @Transactional
    public int handleOrderReturn(Map<String, String> fields) {
        String vnp_SecureHash = fields.get("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VnPayUtil.hashAllFields(fields, vnPayProperties.getSecretKey());
        if (!signValue.equals(vnp_SecureHash)) {
            log.warn("Cảnh báo: Phát hiện chữ ký VNPAY không hợp lệ!");
            return -1; // Sai chữ ký
        }

        String txnId = fields.get("vnp_TxnRef");
        String transactionStatus = fields.get("vnp_TransactionStatus");

        if (txnId == null) {
            throw new AppException(ErrorCode.INVALID_PARAMETER);
        }

        Transaction transaction = transactionRepository.findByTxnId(txnId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));

        // Lấy thông điệp lỗi thông qua hàm Helper
        String description = getTransactionDescription(transactionStatus, txnId);
        boolean isSuccess = "00".equals(transactionStatus);

        // Cập nhật Database
        transaction.setStatus(isSuccess ? TransStatusEnum.SUCCESS : TransStatusEnum.FAILED);
        transaction.setDescription(description);
        transactionRepository.save(transaction);

        // Xử lý cộng tiền và thông báo
        if (isSuccess) {
            processSuccessfulTransaction(transaction, description);
            return 1;
        } else {
            processFailedTransaction(transaction, description, transactionStatus);
            return 0;
        }
    }

    // ==========================================
    // CÁC HÀM HELPER NỘI BỘ (PRIVATE)
    // ==========================================

    private void processSuccessfulTransaction(Transaction transaction, String description) {
        User user = transaction.getUser();
        user.setBalance(user.getBalance() + transaction.getAmount());
        userRepository.save(user);

        // Tạo thông báo in-app
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setRead(false);
        notification.setType(NotificationType.TRANSACTION);
        notification.setMessage(description + ", tài khoản của bạn được cộng " + transaction.getAmount() + " VNĐ");
        notificationService.createNotification(notification);

        // Gửi Email
        String transactionTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
        emailService.sendDepositSuccessEmail(user.getEmail(), user.getName(), transaction.getAmount(), transactionTime);
    }

    private void processFailedTransaction(Transaction transaction, String description, String statusCode) {
        Notification notification = new Notification();
        notification.setUser(transaction.getUser());
        notification.setRead(false);
        notification.setType(NotificationType.TRANSACTION);

        if ("02".equals(statusCode)) {
            notification.setMessage("Giao dịch nạp tiền qua VNPAY (" + transaction.getTxnId() + ") của bạn đã bị hủy.");
        } else {
            notification.setMessage("Giao dịch nạp tiền qua VNPAY (" + transaction.getTxnId() + ") không thể hoàn tất: "
                    + description + ". Vui lòng thử lại.");
        }
        notificationService.createNotification(notification);
    }

    private String getTransactionDescription(String statusCode, String txnId) {
        switch (statusCode) {
            case "00":
                return "Giao dịch nạp tiền qua VNPAY (" + txnId + ") thành công";
            case "02":
                return "Người dùng hủy giao dịch";
            case "07":
                return "Trừ tiền thành công, giao dịch bị nghi ngờ (lừa đảo, bất thường)";
            case "09":
                return "Thẻ/Tài khoản chưa đăng ký InternetBanking";
            case "10":
                return "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11":
                return "Hết hạn chờ thanh toán";
            case "12":
                return "Thẻ/Tài khoản bị khóa";
            case "13":
                return "Sai mật khẩu xác thực giao dịch (OTP)";
            case "24":
                return "Khách hàng hủy giao dịch";
            case "51":
                return "Không đủ số dư để thực hiện giao dịch";
            case "65":
                return "Vượt quá hạn mức giao dịch trong ngày";
            case "75":
                return "Ngân hàng thanh toán đang bảo trì";
            case "79":
                return "Sai mật khẩu thanh toán quá số lần quy định";
            case "99":
                return "Lỗi không xác định từ phía ngân hàng";
            default:
                return "Lỗi không xác định (mã: " + statusCode + ")";
        }
    }
}