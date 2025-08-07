package com.krasavik.invojsik.controller;

import com.krasavik.invojsik.dto.InvoiceDataDTO;
import com.krasavik.invojsik.entity.Address;
import com.krasavik.invojsik.entity.Invoice;
import com.krasavik.invojsik.entity.InvoiceItem;
import com.krasavik.invojsik.entity.PaymentDetails;
import com.krasavik.invojsik.repository.AddressRepository;
import com.krasavik.invojsik.repository.InvoiceItemRepository;
import com.krasavik.invojsik.repository.InvoiceRepository;
import com.krasavik.invojsik.repository.PaymentDetailsRepository;
import com.krasavik.invojsik.service.PdfGenerationService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/invoices")
public class PdfController {

    private final PdfGenerationService pdfGenerationService;
    private final InvoiceRepository invoiceRepository;
    private final AddressRepository addressRepository;
    private final PaymentDetailsRepository paymentDetailsRepository;
    private final InvoiceItemRepository invoiceItemRepository;

    public PdfController(PdfGenerationService pdfGenerationService,
                           InvoiceRepository invoiceRepository,
                           AddressRepository addressRepository,
                           PaymentDetailsRepository paymentDetailsRepository,
                           InvoiceItemRepository invoiceItemRepository) {
        this.pdfGenerationService = pdfGenerationService;
        this.invoiceRepository = invoiceRepository;
        this.addressRepository = addressRepository;
        this.paymentDetailsRepository = paymentDetailsRepository;
        this.invoiceItemRepository = invoiceItemRepository;
    }

    @PostMapping(value = "/generate-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Transactional
    public ResponseEntity<byte[]> generatePdf(@RequestBody InvoiceDataDTO invoiceData) {
        try {
            // Map DTO to Entities
            Address billFrom = mapAddressDtoToEntity(invoiceData.getBillFrom());
            Address billTo = mapAddressDtoToEntity(invoiceData.getBillTo());
            PaymentDetails paymentDetails = mapPaymentDetailsDtoToEntity(invoiceData.getPaymentDetails());

            // Save related entities first
            billFrom = addressRepository.save(billFrom);
            billTo = addressRepository.save(billTo);
            paymentDetails = paymentDetailsRepository.save(paymentDetails);

            Invoice invoice = new Invoice();
            invoice.setInvoiceNumber(invoiceData.getInvoiceNumber());
            invoice.setInvoiceDate(LocalDate.parse(invoiceData.getInvoiceDate()));
            invoice.setDueDate(LocalDate.parse(invoiceData.getDueDate()));
            invoice.setDateOfTaxableSupply(LocalDate.parse(invoiceData.getDateOfTaxableSupply()));
            invoice.setCurrency(invoiceData.getCurrency());
            invoice.setBillFrom(billFrom);
            invoice.setBillTo(billTo);
            invoice.setNotes(invoiceData.getNotes());
            invoice.setPaymentDetails(paymentDetails);
            invoice.setVatExempt(invoiceData.isVatExempt());

            // Save invoice to get its ID
            invoice = invoiceRepository.save(invoice);

            // Map and save invoice items
            Invoice finalInvoice = invoice;
            List<InvoiceItem> items = invoiceData.getItems().stream()
                    .map(itemDto -> {
                        InvoiceItem item = new InvoiceItem();
                        item.setDescription(itemDto.getDescription());
                        item.setQuantity(itemDto.getQuantity());
                        item.setRate(itemDto.getRate());
                        item.setInvoice(finalInvoice);
                        return item;
                    })
                    .collect(Collectors.toList());
            invoiceItemRepository.saveAll(items);
            invoice.setItems(items);

            byte[] pdfBytes = pdfGenerationService.generatePdfFromInvoiceData(invoice);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "invoice.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (IOException e) {
            log.error("Error generating invoice: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private Address mapAddressDtoToEntity(InvoiceDataDTO.AddressDTO dto) {
        Address entity = new Address();
        entity.setCompanyName(dto.getCompanyName());
        entity.setIdNumber(dto.getIdNumber());
        entity.setVatNumber(dto.getVatNumber());
        entity.setStreetAddress(dto.getStreetAddress());
        entity.setCity(dto.getCity());
        entity.setZipCode(dto.getZipCode());
        entity.setCountry(dto.getCountry());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        return entity;
    }

    private PaymentDetails mapPaymentDetailsDtoToEntity(InvoiceDataDTO.PaymentDetailsDTO dto) {
        PaymentDetails entity = new PaymentDetails();
        entity.setBankName(dto.getBankName());
        entity.setIban(dto.getIban());
        entity.setSwift(dto.getSwift());
        return entity;
    }
}
