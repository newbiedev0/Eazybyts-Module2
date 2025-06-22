package com.application.stocktrad.service;

import com.application.stocktrad.dto.StockResponse;
import com.application.stocktrad.exception.GlobalExceptionHandler;
import com.application.stocktrad.model.Stock;
import com.application.stocktrad.repository.StockRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    private final Random random = new Random();

    @PostConstruct
    public void initStocks() {
        if (stockRepository.count() == 0) {
            stockRepository.save(new Stock(null, "AAPL", "Apple Inc.", new BigDecimal("170.00")));
            stockRepository.save(new Stock(null, "GOOG", "Alphabet Inc. (Google)", new BigDecimal("1500.00")));
            stockRepository.save(new Stock(null, "MSFT", "Microsoft Corp.", new BigDecimal("400.00")));
            stockRepository.save(new Stock(null, "AMZN", "Amazon.com Inc.", new BigDecimal("180.00")));
            stockRepository.save(new Stock(null, "NVDA", "NVIDIA Corp.", new BigDecimal("900.00")));
            stockRepository.save(new Stock(null, "TSLA", "Tesla Inc.", new BigDecimal("175.00")));
            stockRepository.save(new Stock(null, "META", "Meta Platforms Inc.", new BigDecimal("500.00")));
        }
    }

    @Scheduled(fixedRate = 5000) 
    @Transactional
    public void updateStockPrices() {
        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            double changePercentage = (random.nextDouble() * 0.04) - 0.02; 
            BigDecimal priceChange = stock.getCurrentPrice().multiply(new BigDecimal(String.valueOf(changePercentage)));
            BigDecimal newPrice = stock.getCurrentPrice().add(priceChange).setScale(2, RoundingMode.HALF_UP);

            if (newPrice.compareTo(BigDecimal.ZERO) < 0.1) { 
                newPrice = new BigDecimal("0.10");
            }
            stock.setCurrentPrice(newPrice);
            stockRepository.save(stock);
        }
    }

    public List<StockResponse> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(stock -> new StockResponse(stock.getId(), stock.getSymbol(), stock.getName(), stock.getCurrentPrice()))
                .collect(Collectors.toList());
    }

    public Stock getStockById(Long stockId) {
        return stockRepository.findById(stockId)
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("Stock not found with ID: " + stockId, HttpStatus.NOT_FOUND));
    }
}


