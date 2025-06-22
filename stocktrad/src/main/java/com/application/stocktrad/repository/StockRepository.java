package com.application.stocktrad.repository;

import com.application.stocktrad.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
}

