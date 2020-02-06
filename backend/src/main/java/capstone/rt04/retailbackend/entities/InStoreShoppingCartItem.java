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
public class InStoreShoppingCartItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long inStoreShoppingCartItemId;

    @NotNull
    @Column(nullable = false)
    private Integer quantity;
    
    @ManyToOne
    @NotNull
    @JoinColumn(nullable = false)
    private ProductVariant productVariant;

    public InStoreShoppingCartItem() {
    }
    
    public InStoreShoppingCartItem(Integer quantity, ProductVariant productVariant) {
        this.quantity = quantity;
        this.productVariant = productVariant;
    }
    
    
    
    
    
    
    
}
