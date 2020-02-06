/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Time;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
public class Store implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long storeId;
    
    @NotNull
    @Column(nullable = false)
    private Integer numChangingRooms;
    
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
    
    @OneToOne
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
    }
    

    public Store(Integer numChangingRooms, Time openingTime, Time closingTime, Integer numManagers, Integer numAssistants, Address address) {
        this.numChangingRooms = numChangingRooms;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.numManagers = numManagers;
        this.numAssistants = numAssistants;
        this.address = address;
    }
    

}
