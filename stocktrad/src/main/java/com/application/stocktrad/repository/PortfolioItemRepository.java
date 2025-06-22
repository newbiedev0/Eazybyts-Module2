package com.application.stocktrad.repository;

import com.application.stocktrad.model.PortfolioItem;
import com.application.stocktrad.model.Stock;
import com.application.stocktrad.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByUser(User user);
    Optional<PortfolioItem> findByUserAndStock(User user, Stock stock);
}

