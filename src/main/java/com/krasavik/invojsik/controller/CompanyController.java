package com.krasavik.invojsik.controller;

import com.krasavik.invojsik.dto.CompanyInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final WebClient webClient;

    public CompanyController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://www.finstat.sk/api/").build();
    }

    @GetMapping("/search")
    public Flux<CompanyInfo> searchCompanies(@RequestParam String name) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/autocomplete").queryParam("query", name).build())
                .retrieve()
                .bodyToFlux(CompanyInfo.class);
    }
}
