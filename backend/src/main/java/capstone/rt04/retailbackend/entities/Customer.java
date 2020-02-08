/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.Email;
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
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long customerId;

    @NotNull
    @Column(nullable = false)
    private String firstName;
    
    @NotNull
    @Column(nullable = false)
    private String lastName;
    
    @NotNull
    @Column(nullable = false, unique = true)
    @Email(message = "Email format is invalid")
    private String email; 
    
    @NotNull
    @Column(columnDefinition = "CHAR(64) NOT NULL")
    private String password;
    
    @NotNull
    @Column(nullable = false)
    private boolean verified;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp createdDateTime; 
    
    //Relationships below 
    @ManyToMany
    private List<PromoCode> usedPromoCodes;
    
    @OneToOne(cascade = CascadeType.REMOVE)
    private Measurements measurements;
    
    @OneToOne(cascade = CascadeType.REMOVE)
    private VerificationCode verificationCode;
    
    @OneToMany(cascade = CascadeType.REMOVE)
    private List<CreditCard> creditCards;
    
    @OneToMany(cascade = CascadeType.REMOVE)
    private List<Address> shippingAddresses;
    
    @OneToMany(mappedBy = "customer")
    private List<Review> reviews;
    
    @OneToMany(mappedBy = "customer")
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "customer")
    private List<Refund> refunds;

    @OneToOne
    //TODO: Uncomment when shopping cart CRUD available
//    @JoinColumn(nullable = false)
//    @NotNull
    private ShoppingCart inStoreShoppingCart;

    @OneToOne
    //TODO: Uncomment when shopping cart CRUD available
//    @JoinColumn(nullable = false)
//    @NotNull
    private ShoppingCart onlineShoppingCart;
    
    @ManyToMany
    private List<ProductVariant> wishlistItems;
    
    @ManyToMany
    private List<ProductVariant> reservationCartItems;
    
    @OneToMany(mappedBy = "customer")
    private List<Reservation> reservations;

    public Customer() {
        this.createdDateTime = new Timestamp(System.currentTimeMillis());
        this.verified = false;
        this.usedPromoCodes = new ArrayList<>();
        this.creditCards = new ArrayList<>();
        this.shippingAddresses = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.transactions = new ArrayList<>();
        this.refunds = new ArrayList<>();
        this.wishlistItems = new ArrayList<>();
        this.reservationCartItems = new ArrayList<>();
        this.reservations = new ArrayList<>();
    }


    public Customer(String firstName, String lastName, String email, String password) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    
    
}
