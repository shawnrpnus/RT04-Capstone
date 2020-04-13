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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

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
public class Payroll implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long payrollId;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal amount;
    
    private LocalDate paymentDateTime;
    private Boolean status;
    private int numLeavesTakenThisMonth;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff staff;

    public Payroll() {
    }

    public Payroll(BigDecimal amount, Staff staff, LocalDate paymentDateTime, int numLeavesTakenThisMonth) {
        this.status = false;
        this.amount = amount;
        this.staff = staff;
        this.paymentDateTime = paymentDateTime;
        this.numLeavesTakenThisMonth = numLeavesTakenThisMonth;
    }
    
  
}
