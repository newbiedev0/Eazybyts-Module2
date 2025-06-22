package com.application.stocktrad.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioItemResponse {
    private Long stockId;
    private String symbol;
    private String name;
    private Integer quantity;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
}

