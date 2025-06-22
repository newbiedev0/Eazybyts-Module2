package com.application.stocktrad.repository;

import com.application.stocktrad.model.Transaction;
import com.application.stocktrad.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByTimestampDesc(User user);
}
