/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
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
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "transactionId")
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long transactionId;
    
    private Timestamp createdDateTime;
    
    private CollectionModeEnum collectionMode;
    
    private Integer totalQuantity;
    
    private BigDecimal initialTotalPrice;
    
    private BigDecimal finalTotalPrice; //after discounts etc.
    
    private DeliveryStatusEnum deliveryStatus;
    
    private Timestamp deliveredDateTime;
    
    @ManyToOne
    private PromoCode promoCode;
    
    @OneToMany(mappedBy = "transaction")
    @Size(min = 1)
    private List<TransactionLineItem> transactionLineItems;
    
    @ManyToMany(mappedBy = "customerOrdersToDeliver")
    private List<Delivery> deliveries;
    
    @ManyToOne(optional = false)
    private Customer customer;
    
    @ManyToOne
    private Store store;
    
    public Transaction() {
        this.createdDateTime = new Timestamp(System.currentTimeMillis());
    }

    public Transaction(Customer customer) {
        this();
        this.customer = customer;
    }
    
}


