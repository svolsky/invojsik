package com.krasavik.invojsik.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String idNumber;
    private String vatNumber;
    private String streetAddress;
    private String city;
    private String zipCode;
    private String country;
    private String email;
    private String phone;
}