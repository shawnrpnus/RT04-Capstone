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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class CreditCard implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long creditCardId;

    @Size(min = 4, max = 4)
    private String last4;

    private Integer expiryMonth;

    private Integer expiryYear;

    @NotNull(message = "Payment method ID must be provided")
    private String paymentMethodId;

    private String issuer;

    private boolean defaultCard;

    public CreditCard() {
    }

    public CreditCard(String last4, String paymentMethodId, Integer expiryMonth, Integer expiryYear, String issuer, Boolean defaultCard) {
        this.last4 = last4;
        this.paymentMethodId = paymentMethodId;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.issuer = issuer;
        this.defaultCard = defaultCard;
    }
}
