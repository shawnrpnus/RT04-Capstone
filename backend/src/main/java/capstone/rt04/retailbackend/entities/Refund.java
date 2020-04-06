/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.RefundModeEnum;
import capstone.rt04.retailbackend.util.enums.RefundStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import javax.persistence.*;
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
public class Refund implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long refundId;

    private String refundNumber;
    
    private Integer quantity;
    
    private BigDecimal refundAmount;
    
    private RefundModeEnum refundMode;
    
    private RefundStatusEnum refundStatus;
    
    private String refundLabelCode;
    
    private Timestamp refundDateTime; 
    
    private String reason;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Customer customer;

    @Transient
    private PromoCode promoCode;
    
//    @OneToOne(optional = false)
//    @JoinColumn(nullable = false)
//    private TransactionLineItem transactionLineItem;

    @OneToMany(mappedBy = "refund")
    @Size(min = 1)
    private List<RefundLineItem> refundLineItems;

    @OneToOne
    private Store store;

    @OneToOne
    private Warehouse warehouse;

    public Refund() {
        this.refundDateTime = new Timestamp(System.currentTimeMillis());
        this.refundNumber = RandomStringUtils.randomAlphanumeric(12);
        this.refundLineItems = new ArrayList<>();
    }

    public Refund(Integer quantity, BigDecimal refundAmount, RefundModeEnum refundMode, RefundStatusEnum refundStatus, String reason) {
        this();
        this.quantity = quantity;
        this.refundAmount = refundAmount;
        this.refundMode = refundMode;
        this.refundStatus = refundStatus;
        this.reason = reason;
//        this.customer = customer;
//        this.transactionLineItem = transactionLineItem;
    }
    
}
