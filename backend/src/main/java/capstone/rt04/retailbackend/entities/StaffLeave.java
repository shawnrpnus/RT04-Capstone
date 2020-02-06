/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
public class StaffLeave implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long leaveId;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp fromDateTime;
    
    @NotNull
    @Column(nullable = false)
    private Timestamp toDateTime;
    
    
    private boolean endorsed; //by direct superior
    
    private boolean approved; //by HR
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff applicant;
    
    @ManyToOne
    private Staff endorser; 
    
    @ManyToOne
    private Staff approver;

    public StaffLeave() {
    }

    public StaffLeave(Timestamp fromDateTime, Timestamp toDateTime, Staff staff) {
        this.fromDateTime = fromDateTime;
        this.toDateTime = toDateTime;
        this.applicant = staff;
    }

}
