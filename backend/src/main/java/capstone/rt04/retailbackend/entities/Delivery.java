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
import java.io.Serializable;
import java.sql.Date;
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
@JsonIdentityInfo(generator = JSOGGenerator.class)
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
