package vn.bds360.backend.modules.transaction.controller;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.bds360.backend.common.constant.TransStatusEnum;
import vn.bds360.backend.common.constant.TransactionFilterType;
import vn.bds360.backend.modules.transaction.entity.Transaction;
import vn.bds360.backend.modules.transaction.service.TransactionService;

@RestController
public class TransactionController {
    private TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/api/admin/payment/transactions")
    public ResponseEntity<Page<Transaction>> getTransactions(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long transactionId,
            @RequestParam(required = false) String txnId,
            @RequestParam(required = false) TransStatusEnum status,
            @RequestParam(required = false, defaultValue = "ALL") TransactionFilterType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        Page<Transaction> transactions = transactionService.getTransactions(
                pageable, email, transactionId, txnId, status, type, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("api/payment/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/api/payment/my-transactions")
    public ResponseEntity<Page<Transaction>> getMyTransactions(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(value = "type", defaultValue = "ALL") TransactionFilterType type,
            @RequestParam(required = false) TransStatusEnum status) {
        Page<Transaction> transactions = transactionService.getCurrentUserTransactions(pageable, type, status);
        return ResponseEntity.ok(transactions);
    }
}
