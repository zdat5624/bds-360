package vn.bds360.backend.modules.transaction.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.bds360.backend.common.dto.response.ApiResponse;
import vn.bds360.backend.common.dto.response.PageResponse;
import vn.bds360.backend.modules.transaction.dto.request.TransactionFilterRequest;
import vn.bds360.backend.modules.transaction.dto.response.TransactionResponse;
import vn.bds360.backend.modules.transaction.service.TransactionService;
import vn.bds360.backend.modules.user.entity.User;
import vn.bds360.backend.security.annotation.CurrentUser;
import vn.bds360.backend.security.annotation.IsAdmin;
import vn.bds360.backend.security.annotation.RequireLogin;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // ==========================================
    // QUẢN LÝ GIAO DỊCH (DÀNH CHO ADMIN)
    // ==========================================
    @GetMapping("/admin/transactions")
    @ResponseStatus(HttpStatus.OK)
    @IsAdmin
    public ApiResponse<PageResponse<TransactionResponse>> getTransactions(
            @Valid @ModelAttribute TransactionFilterRequest filter) {

        return ApiResponse.success(transactionService.getTransactions(filter), "Lấy danh sách giao dịch thành công");
    }

    // ==========================================
    // LỊCH SỬ GIAO DỊCH (DÀNH CHO USER)
    // ==========================================
    @GetMapping("/transactions/my-transactions")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<PageResponse<TransactionResponse>> getMyTransactions(
            @CurrentUser User user,
            @Valid @ModelAttribute TransactionFilterRequest filter) {

        // Truyền thẳng User hoặc UserID xuống Service
        return ApiResponse.success(transactionService.getCurrentUserTransactions(user, filter),
                "Lấy lịch sử giao dịch cá nhân thành công");
    }

    // ==========================================
    // CHI TIẾT GIAO DỊCH
    // ==========================================
    @GetMapping("/transactions/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequireLogin
    public ApiResponse<TransactionResponse> getTransactionById(
            @PathVariable Long id,
            @CurrentUser User user) {

        return ApiResponse.success(transactionService.getTransactionById(id, user),
                "Lấy chi tiết giao dịch thành công");
    }
}