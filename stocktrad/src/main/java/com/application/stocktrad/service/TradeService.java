package com.application.stocktrad.service;


import com.application.stocktrad.dto.PortfolioItemResponse;
import com.application.stocktrad.dto.TransactionResponse;
import com.application.stocktrad.exception.GlobalExceptionHandler;
import com.application.stocktrad.model.PortfolioItem;
import com.application.stocktrad.model.Stock;
import com.application.stocktrad.model.Transaction;
import com.application.stocktrad.model.User;
import com.application.stocktrad.repository.PortfolioItemRepository;
import com.application.stocktrad.repository.TransactionRepository;
import com.application.stocktrad.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockService stockService;

    @Autowired
    private PortfolioItemRepository portfolioItemRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public void buyStock(Long stockId, Integer quantity) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("User not found", HttpStatus.NOT_FOUND));

        Stock stock = stockService.getStockById(stockId);

        BigDecimal totalCost = stock.getCurrentPrice().multiply(new BigDecimal(quantity));

        if (user.getVirtualCash().compareTo(totalCost) < 0) {
            throw new GlobalExceptionHandler.CustomException("Insufficient virtual cash to buy " + quantity + " shares of " + stock.getSymbol(), HttpStatus.BAD_REQUEST);
        }

        user.setVirtualCash(user.getVirtualCash().subtract(totalCost));
        userRepository.save(user);

        PortfolioItem portfolioItem = portfolioItemRepository.findByUserAndStock(user, stock)
                .orElseGet(() -> {
                    PortfolioItem newItem = new PortfolioItem();
                    newItem.setUser(user);
                    newItem.setStock(stock);
                    newItem.setQuantity(0);
                    return newItem;
                });
        portfolioItem.setQuantity(portfolioItem.getQuantity() + quantity);
        portfolioItemRepository.save(portfolioItem);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setStock(stock);
        transaction.setType(Transaction.TransactionType.BUY);
        transaction.setQuantity(quantity);
        transaction.setPriceAtTrade(stock.getCurrentPrice());
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    @Transactional
    public void sellStock(Long stockId, Integer quantity) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("User not found", HttpStatus.NOT_FOUND));

        Stock stock = stockService.getStockById(stockId);

        PortfolioItem portfolioItem = portfolioItemRepository.findByUserAndStock(user, stock)
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("You do not own this stock.", HttpStatus.BAD_REQUEST));

        if (portfolioItem.getQuantity() < quantity) {
            throw new GlobalExceptionHandler.CustomException("Insufficient shares to sell " + quantity + " shares of " + stock.getSymbol(), HttpStatus.BAD_REQUEST);
        }

        BigDecimal totalRevenue = stock.getCurrentPrice().multiply(new BigDecimal(quantity));
        user.setVirtualCash(user.getVirtualCash().add(totalRevenue));
        userRepository.save(user);

        portfolioItem.setQuantity(portfolioItem.getQuantity() - quantity);
        if (portfolioItem.getQuantity() == 0) {
            portfolioItemRepository.delete(portfolioItem);
        } else {
            portfolioItemRepository.save(portfolioItem);
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setStock(stock);
        transaction.setType(Transaction.TransactionType.SELL);
        transaction.setQuantity(quantity);
        transaction.setPriceAtTrade(stock.getCurrentPrice());
        transaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    public List<PortfolioItemResponse> getUserPortfolio() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("User not found", HttpStatus.NOT_FOUND));

        return portfolioItemRepository.findByUser(user).stream()
                .map(item -> {
                    Stock currentStock = stockService.getStockById(item.getStock().getId());
                    BigDecimal currentValue = currentStock.getCurrentPrice().multiply(new BigDecimal(item.getQuantity()));
                    return new PortfolioItemResponse(
                            item.getStock().getId(),
                            item.getStock().getSymbol(),
                            item.getStock().getName(),
                            item.getQuantity(),
                            currentStock.getCurrentPrice(),
                            currentValue
                    );
                })
                .collect(Collectors.toList());
    }

    public BigDecimal getUserVirtualCash() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("User not found", HttpStatus.NOT_FOUND));
        return user.getVirtualCash();
    }

    public List<TransactionResponse> getUserTransactions() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new GlobalExceptionHandler.CustomException("User not found", HttpStatus.NOT_FOUND));

        return transactionRepository.findByUserOrderByTimestampDesc(user).stream()
                .map(transaction -> new TransactionResponse(
                        transaction.getId(),
                        transaction.getStock().getSymbol(),
                        transaction.getStock().getName(),
                        transaction.getType(),
                        transaction.getQuantity(),
                        transaction.getPriceAtTrade(),
                        transaction.getTimestamp()
                ))
                .collect(Collectors.toList());
    }
}
