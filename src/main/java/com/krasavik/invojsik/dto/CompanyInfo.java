package com.krasavik.invojsik.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyInfo {
    private String name;
    private String idNumber;
    private String address;
}
