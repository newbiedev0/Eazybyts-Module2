package com.application.stocktrad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.application.stocktrad.model.Transaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String stockSymbol;
    private String stockName;
    private Transaction.TransactionType type;
    private Integer quantity;
    private BigDecimal priceAtTrade;
    private LocalDateTime timestamp;
}