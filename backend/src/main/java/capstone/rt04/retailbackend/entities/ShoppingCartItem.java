/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@ToString
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "onlineShoppingCartItemId")
public class ShoppingCartItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long onlineShoppingCartItemId;

    @NotNull
    @Column(nullable = false)
    private Integer quantity;
    
    @ManyToOne
    @NotNull
    @JoinColumn(nullable = false)
    private ProductVariant productVariant;

    public ShoppingCartItem() {
    }
    
    public ShoppingCartItem(Integer quantity, ProductVariant productVariant) {
        this.quantity = quantity;
        this.productVariant = productVariant;
    }
    
    
    
    
    
    
    
}
