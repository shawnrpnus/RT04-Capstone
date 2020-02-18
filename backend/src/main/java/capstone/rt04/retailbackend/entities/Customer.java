/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.ErrorMessages;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
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
@ToString(exclude = {"verificationCode", "inStoreShoppingCart", "onlineShoppingCart", "preferredStyles"})
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long customerId;

    @NotNull(message = ErrorMessages.FIRST_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min = 1, message = ErrorMessages.FIRST_NAME_REQUIRED)
    private String firstName;
    
    @NotNull(message = ErrorMessages.LAST_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min = 1, message = ErrorMessages.FIRST_NAME_REQUIRED)
    private String lastName;
    
    @NotNull(message = ErrorMessages.EMAIL_REQUIRED)
    @Column(nullable = false, unique = true)
    @Email(message = ErrorMessages.EMAIL_INVALID)
    private String email;

    @Email(message = ErrorMessages.EMAIL_INVALID)
    private String requestedNewEmail;
    
    @NotNull(message = ErrorMessages.PASSWORD_REQUIRED)
    @Size(min = 1, message = ErrorMessages.PASSWORD_REQUIRED)
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
    private ShoppingCart inStoreShoppingCart;

    @OneToOne
    private ShoppingCart onlineShoppingCart;
    
    @ManyToMany
    private List<ProductVariant> wishlistItems;
    
    @ManyToMany
    private List<ProductVariant> reservationCartItems;
    
    @OneToMany(mappedBy = "customer")
    private List<Reservation> reservations;

    @ManyToMany
    private List<Style> preferredStyles;

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
        this.preferredStyles = new ArrayList<>();
    }


    public Customer(String firstName, String lastName, String email, String password) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    public void addShippingAddress(Address address){
        if (address != null){
            if (!this.shippingAddresses.contains(address)){
                this.shippingAddresses.add(address);
            }
        }
    }

    public void addCreditCard(CreditCard creditCard){
        if (creditCard != null){
            if (!this.creditCards.contains(creditCard)){
                this.creditCards.add(creditCard);
            }
        }
    }

    
}
