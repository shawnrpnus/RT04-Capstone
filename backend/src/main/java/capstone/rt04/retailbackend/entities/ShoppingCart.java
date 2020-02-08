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
import java.math.BigDecimal;
import java.util.ArrayList;
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
        property = "onlineShoppingCartId")
public class ShoppingCart implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long onlineShoppingCartId;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal initialTotalAmount;
    
    private BigDecimal finalTotalAmount;
    
    @OneToMany
    private List<ShoppingCartItem> shoppingCartItems;
    
    @OneToOne(mappedBy = "inStoreShoppingCart")
    @NotNull
    private Customer customer;

    public ShoppingCart() {
        this.initialTotalAmount = BigDecimal.ZERO;
        this.finalTotalAmount = BigDecimal.ZERO;
        this.shoppingCartItems = new ArrayList<>();
    }
    
    

    
}
