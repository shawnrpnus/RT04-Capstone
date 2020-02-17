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

/**
 *
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString(exclude = {"productVariant"})
@JsonIdentityInfo(generator = JSOGGenerator.class)
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

    private Integer reorderQuantity;
    
    @ManyToOne
    private Store store;
    
    @ManyToOne
    private Warehouse warehouse;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private ProductVariant productVariant;
   

    public ProductStock() {
    }

    public ProductStock(Integer quantity, Integer maxQuantity, Integer notificationLevel, Integer reorderQuantity) {
        this();
        this.quantity = quantity;
        this.maxQuantity = maxQuantity;
        this.notificationLevel = notificationLevel;
        this.reorderQuantity = reorderQuantity;
    }

}
