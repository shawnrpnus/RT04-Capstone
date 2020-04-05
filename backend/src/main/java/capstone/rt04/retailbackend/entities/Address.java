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

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long addressId;

    @NotNull(message = "Line 1 is required")
    @Column(nullable = false)
    @Size(min = 1, message = "Line 1 is required")
    private String line1;

    private String line2;

    @NotNull(message = "Postal code is required")
    @Column(nullable = false)
    @Size(min = 6, max = 6, message = "Postal code is invalid")
    private String postalCode;

    private String buildingName;

    private boolean isDefault;

    private boolean isBilling;

    @Column(nullable = false)
    private String lat;

    @Column(nullable = false)
    private String lng;

    public Address() {
    }

    public Address(@NotNull String line1, String line2, @NotNull String postalCode, String buildingName) {
        this();
        this.line1 = line1;
        this.line2 = line2;
        this.postalCode = postalCode;
        this.buildingName = buildingName;
    }

    public Address(String line1, String line2, String postalCode, String buildingName, String lat, String lng) {
        this();
        this.line1 = line1;
        this.line2 = line2;
        this.postalCode = postalCode;
        this.buildingName = buildingName;
        this.lat = lat;
        this.lng = lng;
    }

    public Address(@NotNull(message = "Line 1 is required") @Size(min = 1, message = "Line 1 is required") String line1, String line2, @NotNull(message = "Postal code is required") @Size(min = 6, max = 6, message = "Postal code is invalid") String postalCode, String buildingName, boolean isDefault, boolean isBilling) {
        this.line1 = line1;
        this.line2 = line2;
        this.postalCode = postalCode;
        this.buildingName = buildingName;
        this.isDefault = isDefault;
        this.isBilling = isBilling;
    }
}
