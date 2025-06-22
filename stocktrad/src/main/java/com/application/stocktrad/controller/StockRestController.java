package com.application.stocktrad.controller;

import com.application.stocktrad.dto.PortfolioItemResponse;
import com.application.stocktrad.dto.StockResponse;
import com.application.stocktrad.dto.TradeRequest;
import com.application.stocktrad.dto.TransactionResponse;
import com.application.stocktrad.service.StockService;
import com.application.stocktrad.service.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class StockRestController {

    @Autowired
    private StockService stockService;

    @Autowired
    private TradeService tradeService;

    @GetMapping("/stocks")
    public ResponseEntity<List<StockResponse>> getAllStocks() {
        List<StockResponse> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @PostMapping("/trade/buy")
    public ResponseEntity<String> buyStock(@Valid @RequestBody TradeRequest request) {
        tradeService.buyStock(request.getStockId(), request.getQuantity());
        return new ResponseEntity<>("Stock bought successfully!", HttpStatus.OK);
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<String> sellStock(@Valid @RequestBody TradeRequest request) {
        tradeService.sellStock(request.getStockId(), request.getQuantity());
        return new ResponseEntity<>("Stock sold successfully!", HttpStatus.OK);
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<PortfolioItemResponse>> getUserPortfolio() {
        List<PortfolioItemResponse> portfolio = tradeService.getUserPortfolio();
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/user/cash")
    public ResponseEntity<BigDecimal> getUserCash() {
        BigDecimal cash = tradeService.getUserVirtualCash();
        return ResponseEntity.ok(cash);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getUserTransactions() {
        List<TransactionResponse> transactions = tradeService.getUserTransactions();
        return ResponseEntity.ok(transactions);
    }
}
