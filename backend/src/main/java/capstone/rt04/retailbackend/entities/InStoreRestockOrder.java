/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
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
        property = "inStoreRestockOrderId")
public class InStoreRestockOrder implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long inStoreRestockOrderId;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp orderDateTime;
    
    private Timestamp deliveryDateTime;
    
    @NotNull
    @Column(nullable = false)
    private DeliveryStatusEnum deliveryStatus;
    
    @ManyToMany(mappedBy = "inStoreRestockOrders")
    private List<Delivery> deliveries;
    
    @OneToMany
    private List<InStoreRestockOrderItem> inStoreRestockOrderItems;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Store store;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Warehouse warehouse;

    public InStoreRestockOrder() {
        this.orderDateTime = new Timestamp(System.currentTimeMillis());
        this.deliveryStatus = DeliveryStatusEnum.PROCESSING;
    }
    
    public InStoreRestockOrder(List<InStoreRestockOrderItem> inStoreRestockOrderItems, Store store, Warehouse warehouse) {
        this();
        this.inStoreRestockOrderItems = inStoreRestockOrderItems;
        this.store = store;
        this.warehouse = warehouse;
    }

    
}
