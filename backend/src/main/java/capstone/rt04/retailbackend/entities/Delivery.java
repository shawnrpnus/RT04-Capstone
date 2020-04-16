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

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
//@ToString(exclude = {"inStoreRestockOrderItems", "customerOrdersToDeliver"})
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Delivery implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long deliveryId;

    private Timestamp deliveryDateTime;

    private Integer maxCapacity;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff deliveryStaff;

    @ManyToMany //each txn can have multiple deliveries in case of failed deliveries
    private List<Transaction> customerOrdersToDeliver;

    @OneToMany
    private List<InStoreRestockOrderItem> inStoreRestockOrderItems;

    public Delivery() {
        this.customerOrdersToDeliver = new ArrayList<>();
        this.inStoreRestockOrderItems = new ArrayList<>();
    }

    public Delivery(Timestamp deliveryDateTime, Staff deliveryStaff, Integer maxCapacity) {
        this();
        this.maxCapacity = maxCapacity;
        this.deliveryDateTime = deliveryDateTime;
        this.deliveryStaff = deliveryStaff;
    }

}
