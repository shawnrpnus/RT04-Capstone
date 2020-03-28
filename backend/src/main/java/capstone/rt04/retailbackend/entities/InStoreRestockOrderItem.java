/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class InStoreRestockOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long inStoreRestockOrderItemId;

    @NotNull
    @Column(nullable = false)
    private Timestamp orderDateTime;

    private Timestamp deliveryDateTime;

    private ItemDeliveryStatusEnum itemDeliveryStatus;

    private Integer quantity;

    @ManyToOne
    private Delivery delivery;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private ProductStock productStock;

    @ManyToOne
    @JoinColumn
    private InStoreRestockOrder inStoreRestockOrder;

    @Transient
    private Integer warehouseStockQuantity;

    public InStoreRestockOrderItem() {
        this.itemDeliveryStatus = ItemDeliveryStatusEnum.PROCESSING;
        this.orderDateTime = new Timestamp(System.currentTimeMillis());
    }

    public InStoreRestockOrderItem(Integer quantity, ProductStock productStock, Timestamp orderDateTime) {
        this();
        this.quantity = quantity;
        this.productStock = productStock;
        this.orderDateTime = orderDateTime;
    }

}
