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
import java.io.Serializable;
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
        property = "warehouseId")
public class Warehouse implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long warehouseId;
    
    @OneToOne(optional = false)
    private Address address;
    
    @OneToMany(mappedBy = "warehouse")
    private List<InStoreRestockOrder> inStoreRestockOrders;
    
    @OneToMany(mappedBy = "warehouse")
    private List<ProductStock> productStocks;

    public Warehouse(Address address) {
        this.address = address;
    }

    public Warehouse() {
    }
       
    
}
