/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 *
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class CreditCard implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long creditCardId;
    
    private String number; //encrypted
    
    private String cvv; //encrypted
    
    private Date expiry;
    
    private boolean isDefault;

    public CreditCard() {
    }

    public CreditCard(String number, String cvv, Date expiry, boolean isDefault) {
        this.number = number;
        this.cvv = cvv;
        this.expiry = expiry;
        this.isDefault = isDefault;
    }
    
}
