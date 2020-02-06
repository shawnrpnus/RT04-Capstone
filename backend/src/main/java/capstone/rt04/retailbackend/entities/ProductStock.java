/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
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
public class ProductStock implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productStockId;
    
    @NotNull
    @Column(nullable = false)
    private Integer quantity;
    
    @NotNull
    @Column(nullable = false)
    private Integer maxQuantity;
    
    private String QRcode;
    
    @NotNull
    @Column(nullable = false)
    private Integer notificationLevel;
    
    @ManyToOne
    private Store store;
    
    @ManyToOne
    private Warehouse warehouse;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private ProductVariant productVariant;
   

    public ProductStock() {
    }

    public ProductStock(Integer quantity, Integer maxQuantity, Integer notificationLevel) {
        this();
        this.quantity = quantity;
        this.maxQuantity = maxQuantity;
        this.notificationLevel = notificationLevel;
    }

}
