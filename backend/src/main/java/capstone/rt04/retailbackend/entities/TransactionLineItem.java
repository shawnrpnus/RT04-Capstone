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
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

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
public class TransactionLineItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long transactionLineItemId;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal initialSubTotal;

    private BigDecimal finalSubTotal;
    
    @NotNull
    @Column(nullable = false)
    private Integer quantity;
    
    @ManyToOne
    @JoinColumn
    private Transaction transaction;
    
    @OneToOne(mappedBy = "transactionLineItem")
    private Refund refund;
    
    @ManyToOne(optional = false) // persistent constraint
    @JoinColumn(nullable = false) // db constraint
    private ProductVariant productVariant;
            
    public TransactionLineItem() {
    }

    public TransactionLineItem(BigDecimal initialSubTotal, Integer quantity, Transaction transaction, ProductVariant productVariant) {
        this.initialSubTotal = initialSubTotal;
        this.quantity = quantity;
        this.transaction = transaction;
        this.productVariant = productVariant;
    }
      
}
