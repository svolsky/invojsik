package com.krasavik.invojsik.controller;

import com.krasavik.invojsik.dto.InvoiceDataDTO;
import com.krasavik.invojsik.service.PdfGenerationService;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/invoices")
public class PdfController {

    private final PdfGenerationService pdfGenerationService;

    public PdfController(PdfGenerationService pdfGenerationService) {
        this.pdfGenerationService = pdfGenerationService;
    }

    @PostMapping(value = "/generate-pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generatePdf(@RequestBody InvoiceDataDTO invoiceData) {
        try {
            byte[] pdfBytes = pdfGenerationService.generatePdfFromInvoiceData(invoiceData);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // Этот заголовок говорит браузеру открывать файл в новой вкладке, а не скачивать
            headers.setContentDispositionFormData("inline", "invoice.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (IOException e) {
            log.error("Error generating invoice: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
