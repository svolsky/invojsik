package com.krasavik.invojsik.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private LocalDate dateOfTaxableSupply;
    private String currency;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_from_address_id", referencedColumnName = "id")
    private Address billFrom;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_to_address_id", referencedColumnName = "id")
    private Address billTo;

    private String notes;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_details_id", referencedColumnName = "id")
    private PaymentDetails paymentDetails;

    private boolean isVatExempt;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> items;
}
