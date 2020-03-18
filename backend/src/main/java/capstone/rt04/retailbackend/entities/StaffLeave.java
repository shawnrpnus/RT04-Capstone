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
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;

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
public class StaffLeave implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long staffLeaveId;
    
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
