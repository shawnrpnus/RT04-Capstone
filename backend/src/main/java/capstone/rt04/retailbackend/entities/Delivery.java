/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
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
public class Delivery implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long deliveryId;
    
    private Date deliveryDate;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff deliveryStaff;
    
    @ManyToMany //each txn can have multiple deliveries in case of failed deliveries
    private List<Transaction> customerOrdersToDeliver;
    
    @ManyToMany
    private List<InStoreRestockOrder> inStoreRestockOrders;

    public Delivery() {
    }

    public Delivery(Date deliveryDate, Staff deliveryStaff) {
        this.deliveryDate = deliveryDate;
        this.deliveryStaff = deliveryStaff;
    }
    
}
