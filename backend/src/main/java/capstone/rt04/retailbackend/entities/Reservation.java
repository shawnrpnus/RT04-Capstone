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
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.ZoneId;
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
//@ToString(exclude = {"productVariants", "customer", "store"})
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long reservationId;
    
    private Timestamp reservationDateTime;
    
    private boolean attended;
    
    private boolean isHandled;
    
    @ManyToMany
    private List<ProductVariant> productVariants;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Customer customer;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Store store;

    public Reservation() {
        this.attended = false;
        this.isHandled = false;
        this.productVariants = new ArrayList<>();
    }

    public Reservation(Timestamp reservationDateTime, List<ProductVariant> productVariants, Customer customer, Store store) {
        this();
        this.reservationDateTime = reservationDateTime;
        this.productVariants.addAll(productVariants);
        this.customer = customer;
        this.store = store;
    }

    public LocalDate getReservationLocalDate() {
        return this.reservationDateTime.toInstant().atZone(ZoneId.of("Singapore")).toLocalDate();
    }

    public boolean isBetween(String fromDateString, String toDateString) {
        LocalDate createdLocalDate = getReservationLocalDate();
        if (fromDateString == null && toDateString == null) {
            return true;
        }

        if (fromDateString == null) {
            LocalDate toDate = LocalDate.parse(toDateString);
            return (createdLocalDate.isEqual(toDate) || createdLocalDate.isBefore(toDate));
        }

        if (toDateString == null) {
            LocalDate fromDate = LocalDate.parse(fromDateString);
            return (createdLocalDate.isEqual(fromDate) || createdLocalDate.isAfter(fromDate));
        }

        LocalDate toDate = LocalDate.parse(toDateString);
        LocalDate fromDate = LocalDate.parse(fromDateString);
        return ((createdLocalDate.isEqual(fromDate) || createdLocalDate.isEqual(toDate)) ||
                (createdLocalDate.isAfter(fromDate) && createdLocalDate.isBefore(toDate)));

    }

}
