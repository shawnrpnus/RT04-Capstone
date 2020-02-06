/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author shawn
 */
@Entity
public class Payroll implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long payrollId;
    
    @NotNull
    @Column(nullable = false)
    private BigDecimal amount;
    
    private Timestamp paymentDateTime;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff staff;

    public Payroll() {
    }

    public Payroll(BigDecimal amount, Staff staff) {
        this.amount = amount;
        this.staff = staff;
    }
    
  
}
