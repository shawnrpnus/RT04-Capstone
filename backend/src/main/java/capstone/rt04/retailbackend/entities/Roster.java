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
import java.sql.Date;
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
        property = "rosterId")
public class Roster implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rosterId;
    
    private Date fromDate;
    
    private Date toDate;
    
    @OneToMany(mappedBy = "roster")
    private List<Staff> staffList;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Store store;

    public Roster() {
    }

    public Roster(Date fromDate, Date toDate) {
        this.fromDate = fromDate;
        this.toDate = toDate;
    }

    public Roster(Date fromDate, Date toDate, List<Staff> staffList, Store store) {
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.staffList = staffList;
        this.store = store;
    }
    
}
