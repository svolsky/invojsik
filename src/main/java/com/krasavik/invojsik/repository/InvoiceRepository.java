package com.krasavik.invojsik.repository;

import com.krasavik.invojsik.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
