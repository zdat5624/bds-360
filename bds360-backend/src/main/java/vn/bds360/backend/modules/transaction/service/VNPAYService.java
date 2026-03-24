package vn.bds360.backend.modules.transaction.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import vn.bds360.backend.common.constant.NotificationType;
import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.email.service.EmailService;
import vn.bds360.backend.modules.notification.entity.Notification;
import vn.bds360.backend.modules.notification.service.NotificationService;
import vn.bds360.backend.modules.transaction.config.ConfigVNPAY;
import vn.bds360.backend.modules.transaction.dto.response.ResPaymentLinkDTO;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.repository.TransactionRepository;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.modules.user.repository.UserRepository;
import vn.bds360.backend.security.SecurityUtil;

@Service
public class VNPAYService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Value("${vnp.PayUrl}")
    private String vnp_PayUrl;

    @Value("${vnp.ReturnUrl.backend}")
    private String vnp_ReturnUrl;

    @Value("${vnp.TmnCode}")
    private String vnp_TmnCode;

    @Value("${vnp.secretKey")
    private String secretKey;

    public VNPAYService(TransactionRepository transactionRepository, UserRepository userRepository,
            EmailService emailService, NotificationService notificationService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    public ResPaymentLinkDTO createVNPayLink(long inputAmount)
            throws UnsupportedEncodingException, InputInvalidException {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";

        // amout
        long amount = inputAmount * 100;
        // long amount = Integer.parseInt(req.getParameter("amount")) * 100;

        // Bank code

        // String bankCode = req.getParameter("bankCode");

        // Lấy user hiện tại từ SecurityUtil
        String userEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InputInvalidException("Chưa đăng nhập"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InputInvalidException("Không tìm thấy người dùng"));

        String vnp_TxnRef = ConfigVNPAY.getRandomNumber(10);

        String vnp_IpAddr = "127.0.0.1";
        // String vnp_IpAddr = Config.getIpAddress(req);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        // if (bankCode != null && !bankCode.isEmpty()) {
        // vnp_Params.put("vnp_BankCode", bankCode);
        // }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan giao dich nap tien ID: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        // language default: vn
        vnp_Params.put("vnp_Locale", "vn");

        // String locate = req.getParameter("language");
        // if (locate != null && !locate.isEmpty()) {
        // vnp_Params.put("vnp_Locale", locate);
        // } else {
        // vnp_Params.put("vnp_Locale", "vn");
        // }
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = ConfigVNPAY.hmacSHA512(ConfigVNPAY.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnp_PayUrl + "?" + queryUrl;

        // Tạo giao dịch mới
        Transaction transaction = new Transaction();
        transaction.setAmount(inputAmount);
        transaction.setStatus(TransStatusEnum.PENDING);
        transaction.setDescription("Giao dịch nạp tiền đang chờ thanh toán");
        transaction.setUser(user);
        transaction.setPaymentLink(paymentUrl);
        transaction.setTxnId(vnp_TxnRef);
        this.transactionRepository.save(transaction);

        ResPaymentLinkDTO res = new ResPaymentLinkDTO();
        res.setPaymentLink(paymentUrl);
        return res;
    }

    @Transactional
    public int handleOrderReturn(HttpServletRequest request) throws InputInvalidException {
        // Begin process return from VNPAY
        Map fields = new HashMap();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = URLEncoder.encode((String) params.nextElement(),
                        StandardCharsets.US_ASCII.toString());
                fieldValue = URLEncoder.encode(request.getParameter(fieldName),
                        StandardCharsets.US_ASCII.toString());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = ConfigVNPAY.hashAllFields(fields);

        String txnId = request.getParameter("vnp_TxnRef");
        String transactionStatus = request.getParameter("vnp_TransactionStatus");

        if (txnId == null) {
            throw new InputInvalidException("Không tìm thấy mã giao dịch.");
        }

        Transaction transaction = transactionRepository.findByTxnId(txnId)
                .orElseThrow(() -> new InputInvalidException("Giao dịch không tồn tại"));

        String description;
        TransStatusEnum status;

        switch (transactionStatus) {
            case "00":
                status = TransStatusEnum.SUCCESS;
                description = "Giao dịch nạp tiền qua VNPAY(" + txnId + ") thành công";
                break;
            case "02":
                status = TransStatusEnum.FAILED;
                description = "Người dùng hủy giao dịch";
                break;
            case "07":
                status = TransStatusEnum.FAILED;
                description = "Trừ tiền thành công, giao dịch bị nghi ngờ (lừa đảo, bất thường)";
                break;
            case "09":
                status = TransStatusEnum.FAILED;
                description = "Thẻ/Tài khoản chưa đăng ký InternetBanking";
                break;
            case "10":
                status = TransStatusEnum.FAILED;
                description = "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
                break;
            case "11":
                status = TransStatusEnum.FAILED;
                description = "Hết hạn chờ thanh toán";
                break;
            case "12":
                status = TransStatusEnum.FAILED;
                description = "Thẻ/Tài khoản bị khóa";
                break;
            case "13":
                status = TransStatusEnum.FAILED;
                description = "Sai mật khẩu xác thực giao dịch (OTP)";
                break;
            case "24":
                status = TransStatusEnum.FAILED;
                description = "Khách hàng hủy giao dịch";
                break;
            case "51":
                status = TransStatusEnum.FAILED;
                description = "Không đủ số dư để thực hiện giao dịch";
                break;
            case "65":
                status = TransStatusEnum.FAILED;
                description = "Vượt quá hạn mức giao dịch trong ngày";
                break;
            case "75":
                status = TransStatusEnum.FAILED;
                description = "Ngân hàng thanh toán đang bảo trì";
                break;
            case "79":
                status = TransStatusEnum.FAILED;
                description = "Sai mật khẩu thanh toán quá số lần quy định";
                break;
            case "99":
                status = TransStatusEnum.FAILED;
                description = "Lỗi không xác định";
                break;
            default:
                status = TransStatusEnum.FAILED;
                description = "Lỗi không xác định (mã: " + transactionStatus + ")";
                break;
        }

        if (signValue.equals(vnp_SecureHash)) {
            // Cập nhật trạng thái và mô tả
            transaction.setStatus(status);
            transaction.setDescription(description);
            this.transactionRepository.save(transaction);
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {

                User user = transaction.getUser();
                user.setBalance(user.getBalance() + transaction.getAmount());
                user = this.userRepository.save(user);

                Notification notification = new Notification();
                notification.setUser(transaction.getUser());
                notification.setRead(false);
                notification.setType(NotificationType.TRANSACTION);
                notification.setMessage(description + ", tài khoản của bạn cộng " + transaction.getAmount() + " VNĐ");
                this.notificationService.createNotification(notification);
                // send mail
                String transactionTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
                this.emailService.sendDepositSuccessEmail(user.getEmail(), user.getName(), transaction.getAmount(),
                        transactionTime);
                return 1;
            } else {
                Notification notification = new Notification();
                notification.setUser(transaction.getUser());
                notification.setRead(false);
                notification.setType(NotificationType.TRANSACTION);
                notification.setMessage("Giao dịch nạp tiền qua VNPAY(" + txnId + ") của bạn không thể hoàn tất: "
                        + description + ". Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.");
                if (transactionStatus.equals("02")) {
                    notification.setMessage("Giao dịch nạp tiền qua VNPAY(" + txnId
                            + ") của bạn được bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần.");
                }
                this.notificationService.createNotification(notification);
                return 0;
            }

        } else {
            return -1;
        }

    }

}
