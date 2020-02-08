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
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
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
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class PromoCode implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long promoCodeId;

    @NotNull
    @Column(nullable = false)
    private String promoCodeName;

    @NotNull
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal flatDiscount;

    @NotNull
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal percentageDiscount;

    @NotNull
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal minimumPurchase;

    @NotNull
    @Column(nullable = false)
    private Integer numRemaining;

    @ManyToMany
    @Size(min = 1)
    private List<Product> products;

    public PromoCode() {
        this.products = new ArrayList<>();
    }

    public PromoCode(String promoCodeName, BigDecimal flatDiscount, BigDecimal percentageDiscount, BigDecimal minimumPurchase, Integer numRemaining, List<Product> products) {
        this();
        this.promoCodeName = promoCodeName;
        this.flatDiscount = flatDiscount;
        this.percentageDiscount = percentageDiscount;
        this.minimumPurchase = minimumPurchase;
        this.numRemaining = numRemaining;
        this.products = products;
    }

    

}
