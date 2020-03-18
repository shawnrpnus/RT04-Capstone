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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Measurements implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long measurementsId;

    @NotNull(message = "Shoulder measurement is required")
    @DecimalMin(value="35", message = "Shoulder measurement does not fall within valid range")
    @DecimalMax(value="55", message = "Shoulder measurement does not fall within valid range")
    private BigDecimal shoulder;

    @NotNull(message = "Waist measurement is required")
    @DecimalMin(value="60", message = "Waist measurement does not fall within valid range")
    @DecimalMax(value="120", message = "Waist measurement does not fall within valid range")
    private BigDecimal waist;

    @NotNull(message = "Chest measurement is required")
    @DecimalMin(value="60", message = "Chest measurement does not fall within valid range")
    @DecimalMax(value="150", message = "Chest measurement does not fall within valid range")
    private BigDecimal chest;

    @NotNull(message = "Hip measurement is required")
    @DecimalMin(value="60", message = "Hip measurement does not fall within valid range")
    @DecimalMax(value="150", message = "Hip measurement does not fall within valid range")
    private BigDecimal hip;

    @NotNull(message = "Height measurement is required")
    @DecimalMin(value="140", message = "Height measurement does not fall within valid range")
    @DecimalMax(value="200", message = "Height measurement does not fall within valid range")
    private BigDecimal height;

    public Measurements() {
    }
    
}
