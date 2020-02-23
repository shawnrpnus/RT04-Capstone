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
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Time;
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
@ToString(exclude = "productStocks")
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Store implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long storeId;

    @NotNull(message = "Store categoryName is required")
    @Column(nullable = false)
    @Size(min = 1, message = "Store categoryName is required")
    private String storeName;
    
    @NotNull
    @Column(nullable = false)
    private Integer numChangingRooms;

    @NotNull
    @Column(nullable = false)
    private Integer numReservedChangingRooms;

    @NotNull
    @Column(nullable = false)
    private Time openingTime;
    
    @NotNull
    @Column(nullable = false)
    private Time closingTime;
    
    @NotNull
    @Column(nullable = false)
    private Integer numManagers;
    
    @NotNull
    @Column(nullable = false)
    private Integer numAssistants;
    
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @Valid
    private Address address;
    
    @OneToMany(mappedBy = "store")
    private List<Reservation> reservations;
    
    @OneToMany(mappedBy = "store")
    private List<InStoreRestockOrder> inStoreRestockOrders;
    
    @OneToMany(mappedBy = "store")
    private List<ProductStock> productStocks;
    
    @OneToMany(mappedBy = "store")
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "store")
    private List<Roster> rosters;
    
    public Store() {
        this.reservations = new ArrayList<>();
        this.inStoreRestockOrders = new ArrayList<>();
        this.productStocks = new ArrayList<>();
        this.transactions = new ArrayList<>();
        this.rosters = new ArrayList<>();
    }
    

    public Store(String storeName, Integer numChangingRooms, Integer numReservedChangingRooms, Time openingTime, Time closingTime, Integer numManagers, Integer numAssistants, Address address) {
        this();
        this.storeName = storeName;
        this.numChangingRooms = numChangingRooms;
        this.numReservedChangingRooms = numReservedChangingRooms;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.numManagers = numManagers;
        this.numAssistants = numAssistants;
        this.address = address;
    }
    

}
