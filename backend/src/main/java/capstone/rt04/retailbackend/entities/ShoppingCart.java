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
import java.math.BigDecimal;
import java.sql.Timestamp;
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
// @ToString()
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class ShoppingCart implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long shoppingCartId;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal initialTotalAmount;
    
    private BigDecimal finalTotalAmount;

    private Timestamp lastUpdated;
    
    @OneToMany
    private List<ShoppingCartItem> shoppingCartItems;

    public ShoppingCart() {
        this.initialTotalAmount = BigDecimal.ZERO;
        this.finalTotalAmount = BigDecimal.ZERO;
        this.shoppingCartItems = new ArrayList<>();
    }

    public void calculateAndSetInitialTotal(){
        BigDecimal total = BigDecimal.ZERO;
        for (ShoppingCartItem item : this.getShoppingCartItems()){
            Integer quantity = item.getQuantity();
            BigDecimal unitPrice = item.getProductVariant().getProduct().getPrice();
            BigDecimal subTotal = unitPrice.multiply(new BigDecimal(quantity));
            total = total.add(subTotal);
        }
        this.setInitialTotalAmount(total);
    }
    
    

    
}
