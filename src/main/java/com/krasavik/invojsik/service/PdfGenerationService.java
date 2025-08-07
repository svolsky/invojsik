package com.krasavik.invojsik.service;

import com.krasavik.invojsik.entity.Invoice;
import com.openhtmltopdf.extend.FSSupplier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class PdfGenerationService {

    private final TemplateEngine templateEngine;

    @Value("classpath:fonts/DejaVuSans.ttf")
    private Resource fontResource;

    public PdfGenerationService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generatePdfFromInvoiceData(Invoice invoice) throws IOException {
        Context context = new Context();
        context.setVariable("invoice", invoice);

        String htmlContent = templateEngine.process("invoice-template", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlContent, null);
            builder.useFont(fontSupplier(), "DejaVuSans");
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        }
    }

    private FSSupplier<InputStream> fontSupplier() {
        return () -> {
            try {
                return fontResource.getInputStream();
            } catch (IOException e) {
                throw new RuntimeException("Failed to load font", e);
            }
        };
    }

}
