package com.application.stocktrad.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeRequest {
    @NotNull(message = "Stock ID cannot be null")
    private Long stockId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
