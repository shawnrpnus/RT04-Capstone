/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author shawn
 */
@Entity 
@Getter
@Setter
@EqualsAndHashCode
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Discount implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long discountId;
    
    @NotNull(message = "Discount name must not be empty")
    @Size(min = 1, message = "Discount name must not be empty")
    @Column(nullable = false)
    private String discountName;
    
    @NotNull(message = "Start date must not be empty")
    @Column(nullable = false)
    private Timestamp fromDateTime;

    @NotNull(message = "End date must not be empty")
    @Column(nullable = false)
    private Timestamp toDateTime;
    
    @Column(precision = 11, scale = 2)
    @DecimalMin("0.00") //0.00 means not applied, only either flat or percentage can be 0.00

    private BigDecimal flatDiscount; //$5 off, save as 5.00
    
    @Column(precision = 11, scale = 2)
    @DecimalMin("0.00")
    @DecimalMax("1.00")
    private BigDecimal percentageDiscount; //if 10%, save as 0.10
    
    @ManyToMany
    private List<Product> products;

    public Discount() {
        this.products = new ArrayList<>();
    }

    public Discount(String discountName, Timestamp fromDateTime, Timestamp toDateTime, BigDecimal flatDiscount, BigDecimal percentageDiscount) {
        this();
        this.discountName = discountName;
        this.fromDateTime = fromDateTime;
        this.toDateTime = toDateTime;
        this.flatDiscount = flatDiscount;
        this.percentageDiscount = percentageDiscount;
    }
    
}
