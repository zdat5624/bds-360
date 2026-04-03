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
import org.springframework.web.util.UriComponentsBuilder; // Đảm bảo import đúng class này của Spring

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.modules.transaction.config.VnPayProperties;
import vn.bds360.backend.modules.transaction.dto.request.CreatePaymentRequest;
import vn.bds360.backend.modules.transaction.dto.response.PaymentLinkResponse;
import vn.bds360.backend.modules.transaction.service.VNPAYService;
import vn.bds360.backend.modules.transaction.util.VnPayUtil;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPAYService vnpayService;
    private final VnPayProperties vnPayProperties;

    // ==========================================
    // TẠO LINK THANH TOÁN
    // ==========================================
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @RequireLogin
    public ApiResponse<PaymentLinkResponse> createPayment(
            @RequestBody CreatePaymentRequest requestDTO,
            @CurrentUser User user, // <-- Bơm trực tiếp User từ Custom Resolver
            HttpServletRequest request) {

        // Controller có nhiệm vụ lấy IP của Client (Trường hợp ngoại lệ bắt buộc dùng
        // HttpServletRequest)
        String ipAddress = VnPayUtil.getIpAddress(request);

        // Truyền thẳng User xuống Service, Service không cần gọi DB hay SecurityUtil
        // nữa
        PaymentLinkResponse paymentLink = vnpayService.createVNPayLink(user, requestDTO.getAmount(), ipAddress);

        return ApiResponse.success(paymentLink, "Tạo link thanh toán thành công");
    }

    // ==========================================
    // NHẬN KẾT QUẢ TỪ VNPAY (RETURN URL)
    // ==========================================
    @GetMapping("/vnpay-return")
    public void paymentCompleted(
            HttpServletRequest request, // Dùng HttpServletRequest để lấy raw data chuẩn nhất
            HttpServletResponse response) throws IOException {

        // 1. Trích xuất và mã hóa lại toàn bộ tham số theo chuẩn VNPAY
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String paramName = params.nextElement();
            String paramValue = request.getParameter(paramName);

            if (paramValue != null && paramValue.length() > 0) {
                // Mã hóa lại URL y hệt code cũ, dùng Java 10+ StandardCharsets để không cần
                // try-catch
                String fieldName = URLEncoder.encode(paramName, StandardCharsets.US_ASCII);
                String fieldValue = URLEncoder.encode(paramValue, StandardCharsets.US_ASCII);
                fields.put(fieldName, fieldValue);
            }
        }

        // 2. Xử lý kết quả thanh toán dưới tầng Service
        int paymentStatus = this.vnpayService.handleOrderReturn(fields);

        // 3. Build URL Redirect về Frontend
        // Lưu ý: Lấy giá trị thẳng từ request.getParameter để tránh việc
        // UriComponentsBuilder
        // mã hóa đúp (double-encode) các chuỗi đã bị mã hóa trong Map fields
        String redirectUrl = UriComponentsBuilder.fromUriString(vnPayProperties.getReturnUrlFrontend())
                .queryParam("status", paymentStatus)
                .queryParam("orderInfo", request.getParameter("vnp_OrderInfo"))
                .queryParam("paymentTime", request.getParameter("vnp_PayDate"))
                .queryParam("transactionId", request.getParameter("vnp_TxnRef"))
                .queryParam("totalPrice", request.getParameter("vnp_Amount"))
                .queryParam("transactionStatus", request.getParameter("vnp_TransactionStatus"))
                .build()
                .encode()
                .toUriString();

        // 4. Chuyển hướng trình duyệt của User về Frontend
        response.sendRedirect(redirectUrl);
    }
}