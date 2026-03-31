package vn.bds360.backend.modules.transaction.controller;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.exception.InputInvalidException;
import vn.bds360.backend.modules.transaction.config.VnPayProperties;
import vn.bds360.backend.modules.transaction.dto.request.CreatePaymentRequest;
import vn.bds360.backend.modules.transaction.dto.response.PaymentLinkResponse;
import vn.bds360.backend.modules.transaction.service.VNPAYService;
import vn.bds360.backend.modules.transaction.util.VnPayUtil;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor // Tự động tạo constructor
public class PaymentController {

    private final VNPAYService vnpayService;
    private final VnPayProperties vnPayProperties;

    // ==========================================
    // TẠO LINK THANH TOÁN
    // ==========================================
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentLinkResponse> createPayment(
            @RequestBody CreatePaymentRequest createPaymentDTO,
            HttpServletRequest request) {

        // Controller có nhiệm vụ lấy IP và truyền xuống Service
        String ipAddress = VnPayUtil.getIpAddress(request);
        PaymentLinkResponse paymentLink = vnpayService.createVNPayLink(createPaymentDTO.getAmount(), ipAddress);

        return ApiResponse.success(paymentLink, "Tạo link thanh toán thành công");
    }

    // ==========================================
    // NHẬN KẾT QUẢ TỪ VNPAY (RETURN URL)
    // ==========================================
    @GetMapping("/vnpay-return")
    public void paymentCompleted(HttpServletRequest request, HttpServletResponse response)
            throws IOException, InputInvalidException {

        // 1. Controller đóng gói các tham số HTTP thành Map thuần túy
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                fields.put(fieldName, fieldValue);
            }
        }

        // 2. Gọi Service với Map (Service hoàn toàn "sạch" khỏi HTTP Request)
        int paymentStatus = this.vnpayService.handleOrderReturn(fields);

        // 3. Xây dựng chuỗi thông tin để gửi về Frontend
        // Sử dụng Map để lấy dữ liệu thay vì request.getParameter
        String orderInfo = fields.getOrDefault("vnp_OrderInfo", "");
        String paymentTime = fields.getOrDefault("vnp_PayDate", "");
        String transactionId = fields.getOrDefault("vnp_TxnRef", "");
        String totalPrice = fields.getOrDefault("vnp_Amount", "0");
        String transactionStatus = fields.getOrDefault("vnp_TransactionStatus", "");

        String redirectUrl = vnPayProperties.getReturnUrlFrontend()
                + "?status=" + paymentStatus
                + "&orderInfo=" + URLEncoder.encode(orderInfo, StandardCharsets.UTF_8)
                + "&paymentTime=" + URLEncoder.encode(paymentTime, StandardCharsets.UTF_8)
                + "&transactionId=" + URLEncoder.encode(transactionId, StandardCharsets.UTF_8)
                + "&totalPrice=" + URLEncoder.encode(totalPrice, StandardCharsets.UTF_8)
                + "&transactionStatus=" + URLEncoder.encode(transactionStatus, StandardCharsets.UTF_8);

        // 4. Redirect trình duyệt của User về Frontend
        response.sendRedirect(redirectUrl);
    }
}