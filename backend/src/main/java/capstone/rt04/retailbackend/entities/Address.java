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
        property = "addressId")
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long addressId;

    @NotNull
    @Column(nullable = false)
    private String line1;
    
    private String line2;
    
    @NotNull
    @Column(nullable = false)
    private String postalCode;
    
    private String buildingName;
    
    @NotNull
    @Column(nullable = false)
    private boolean isDefault;

    private BigDecimal xCoordinate;
    
    private BigDecimal yCoordinate;

    public Address() {
    }
    
    public Address(String line1, String line2, String postalCode, String buildingName, boolean isDefault, BigDecimal xCoordinate, BigDecimal yCoordinate) {
        this();
        this.line1 = line1;
        this.line2 = line2;
        this.postalCode = postalCode;
        this.buildingName = buildingName;
        this.isDefault = isDefault;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }
    
    
   
}
