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
import java.io.Serializable;
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
public class Warehouse implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long warehouseId;

    private Integer dayOfMonth;
    
    @OneToOne(optional = false)
    private Address address;
    
    @OneToMany(mappedBy = "warehouse")
    private List<InStoreRestockOrder> inStoreRestockOrders;
    
    @OneToMany(mappedBy = "warehouse")
    private List<ProductStock> productStocks;

    public Warehouse() {
        this.inStoreRestockOrders = new ArrayList<>();
        this.productStocks = new ArrayList<>();
        this.dayOfMonth = 5;
    }
    public Warehouse(Address address) {
        this();
        this.address = address;
    }
}
