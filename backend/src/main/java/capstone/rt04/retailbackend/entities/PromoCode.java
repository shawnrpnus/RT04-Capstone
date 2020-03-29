/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.ErrorMessages;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
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
//@ToString(exclude = "products")
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class PromoCode implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long promoCodeId;

    @NotNull (message = ErrorMessages.PROMO_CODE_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min = 1, message = ErrorMessages.PROMO_CODE_NAME_REQUIRED )
    private String promoCodeName;


    @Column(precision = 11, scale = 2)
    @DecimalMin("0.00" )
    private BigDecimal flatDiscount;


    @Column(precision = 11, scale = 2)
    @DecimalMin("0.00")
    @DecimalMax(value = "100.00", message = ErrorMessages.INVALID_PERCENTAGE_DISCOUNT)
    private BigDecimal percentageDiscount;

    @NotNull(message =ErrorMessages.ENTER_MIN)
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin("0.00")
    private BigDecimal minimumPurchase;

    @NotNull(message =ErrorMessages.NUM_REMAINING_REQUIRED)
    @Column(nullable = false)
    private Integer numRemaining;

    @OneToMany(mappedBy = "promoCode")
    private List<Transaction> transactions;

    public PromoCode() {
        this.transactions = new ArrayList<>();
    }

    public PromoCode(String promoCodeName, BigDecimal flatDiscount, BigDecimal percentageDiscount, BigDecimal minimumPurchase, Integer numRemaining) {
        this();
        this.promoCodeName = promoCodeName;
        this.flatDiscount = flatDiscount;
        this.percentageDiscount = percentageDiscount;
        this.minimumPurchase = minimumPurchase;
        this.numRemaining = numRemaining;
    }

}
