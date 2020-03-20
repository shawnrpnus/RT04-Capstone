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
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId;
    
    @NotNull
    @Column(nullable = false)
    private String discountName;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp fromDateTime;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp toDateTime;
    
    @NotNull
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00") //0.00 means not applied, only either flat or percentage can be 0.00
    private BigDecimal flatDiscount; //$5 off, save as 5.00
    
    @NotNull
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00")
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
