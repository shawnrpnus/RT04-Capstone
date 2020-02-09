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
import java.io.Serializable;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class CreditCard implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long creditCardId;

    private String number; //encrypted

    private String cvv; //encrypted

    private Integer expiryMonth;

    private Integer expiryYear;

    private boolean isDefault;

    public CreditCard() {
    }

    public CreditCard(String number, String cvv, Integer expiryMonth, Integer expiryYear, boolean isDefault) {
        this.number = number;
        this.cvv = cvv;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.isDefault = isDefault;
    }
}
