/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import capstone.rt04.retailbackend.util.enums.SizeEnum;

/**
 *
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class SizeDetails implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long sizeDetailsId;
    
    private SizeEnum productSize;
    
    private BigDecimal shoulderLow;
    
    private BigDecimal shoulderHigh;
    
    private BigDecimal chestLow;
    
    private BigDecimal chestHigh;
    
    private BigDecimal waistLow;
    
    private BigDecimal waistHigh;
    
    private BigDecimal hipLow;
    
    private BigDecimal hipHigh;
    
    private BigDecimal heightLow;
    
    private BigDecimal heightHigh;

    public SizeDetails() {
    }

    public SizeDetails(SizeEnum productSize) {
        this.productSize = productSize;
    }



    
}
