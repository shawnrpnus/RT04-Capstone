/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.CollectionModeEnum;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
//@ToString(exclude = "customer")
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long transactionId;

    private String orderNumber;

    private Timestamp createdDateTime;

    private CollectionModeEnum collectionMode;

    private Integer totalQuantity;
    @Column(precision = 11, scale = 2)
    private BigDecimal initialTotalPrice;

    @Column(precision = 11, scale = 2)
    private BigDecimal finalTotalPrice; //after discounts etc.

    private DeliveryStatusEnum deliveryStatus;

    private Timestamp deliveredDateTime;

    private String cardIssuer;

    private String cardLast4;

    @ManyToOne
    private PromoCode promoCode;

    @ManyToOne
    private Address deliveryAddress;

    @ManyToOne
    private Address billingAddress;

    @OneToMany(mappedBy = "transaction")
    @Size(min = 1)
    private List<TransactionLineItem> transactionLineItems;

    @ManyToMany(mappedBy = "customerOrdersToDeliver")
    private List<Delivery> deliveries;

    @ManyToOne(optional = false)
    private Customer customer;

    @ManyToOne
    private Store store;

    @ManyToOne
    private Store storeToCollect;

    public Transaction() {
        this.createdDateTime = new Timestamp(System.currentTimeMillis());
        this.transactionLineItems = new ArrayList<>();
        this.deliveries = new ArrayList<>();
        this.orderNumber = RandomStringUtils.randomAlphanumeric(12);
    }

    public Transaction(Customer customer) {
        this();
        this.customer = customer;
    }

    public LocalDate getCreatedLocalDate() {
        return this.createdDateTime.toInstant().atZone(ZoneId.of("Singapore")).toLocalDate();
    }

    public boolean isBetween(String fromDateString, String toDateString) {
        LocalDate createdLocalDate = getCreatedLocalDate();
        if (fromDateString == null && toDateString == null) {
            return true;
        }

        if (fromDateString == null) {
            LocalDate toDate = LocalDate.parse(toDateString);
            return (createdLocalDate.isEqual(toDate) || createdLocalDate.isBefore(toDate));
        }

        if (toDateString == null) {
            LocalDate fromDate = LocalDate.parse(fromDateString);
            return (createdLocalDate.isEqual(fromDate) || createdLocalDate.isAfter(fromDate));
        }

        LocalDate toDate = LocalDate.parse(toDateString);
        LocalDate fromDate = LocalDate.parse(fromDateString);
        return ((createdLocalDate.isEqual(fromDate) || createdLocalDate.isEqual(toDate)) ||
                (createdLocalDate.isAfter(fromDate) && createdLocalDate.isBefore(toDate)));

    }
}


