/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.enums.LeaveStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Date;

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
    private Date fromDateTime;
    
    @NotNull
    @Column(nullable = false)
    private Date toDateTime;
    
    
    private LeaveStatusEnum status;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff applicant;

    @ManyToOne
    private Staff rejectedBy;

    @ManyToOne
    private Staff endorser;
    
    @ManyToOne
    private Staff approver;

    public StaffLeave() {
    }

    public StaffLeave(Date fromDateTime, Date toDateTime, Staff staff) {
        this.fromDateTime = fromDateTime;
        this.toDateTime = toDateTime;
        this.applicant = staff;
    }

}
