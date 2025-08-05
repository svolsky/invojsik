package com.krasavik.invojsik.dto;

import lombok.Data;
import java.util.List;

@Data
public class InvoiceDataDTO {
    private String invoiceNumber;
    private String invoiceDate;
    private String dueDate;
    private String dateOfTaxableSupply;
    private String currency;
    private AddressDTO billFrom;
    private AddressDTO billTo;
    private List<ItemDTO> items;
    private String notes;
    private PaymentDetailsDTO paymentDetails;

    @Data
    public static class AddressDTO {
        private String companyName;
        private String ico;
        private String dic;
        private String streetAddress;
        private String city;
        private String zipCode;
        private String country;
    }

    @Data
    public static class ItemDTO {
        private String description;
        private int quantity;
        private double rate;
    }

    @Data
    public static class PaymentDetailsDTO {
        private String bankName;
        private String iban;
        private String swift;
    }
}
