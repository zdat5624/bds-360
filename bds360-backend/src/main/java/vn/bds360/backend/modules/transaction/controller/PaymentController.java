package vn.bds360.backend.modules.transaction.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
            @RequestParam Map<String, String> allParams, // <-- Spring tự động gom toàn bộ tham số URL vào Map
            HttpServletResponse response) throws IOException {

        // 1. Xử lý kết quả thanh toán dưới tầng Service
        int paymentStatus = this.vnpayService.handleOrderReturn(allParams);

        // 2. Sử dụng UriComponentsBuilder để build URL Redirect cực kỳ an toàn, tự động
        // encode ký tự đặc biệt
        // 2. Sử dụng UriComponentsBuilder với fromUriString
        String redirectUrl = UriComponentsBuilder.fromUriString(vnPayProperties.getReturnUrlFrontend())
                .queryParam("status", paymentStatus)
                .queryParam("orderInfo", allParams.get("vnp_OrderInfo"))
                .queryParam("paymentTime", allParams.get("vnp_PayDate"))
                .queryParam("transactionId", allParams.get("vnp_TxnRef"))
                .queryParam("totalPrice", allParams.get("vnp_Amount"))
                .queryParam("transactionStatus", allParams.get("vnp_TransactionStatus"))
                .build()
                .encode()
                .toUriString();

        // 3. Chuyển hướng trình duyệt của User về Frontend
        response.sendRedirect(redirectUrl);
    }
}