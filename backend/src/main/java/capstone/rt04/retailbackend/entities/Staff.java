/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
public class Staff implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long staffId;

    @NotNull
    @Column(nullable = false)
    private String firstName;

    @NotNull
    @Column(nullable = false)
    private String lastName;

    @Size(min = 6)
    private String username;

    @Size(min = 6)
    private String password;

    @NotNull
    @Column(nullable = false)
    private Integer leaveRemaining;

    @NotNull
    @Column(nullable = false)
    private String nric;

    @OneToMany(mappedBy = "applicant")
    private List<StaffLeave> leaves;
    
    @Embedded
    private BankDetails bankDetails;
    
    @OneToMany(mappedBy = "creator")
    private List<Advertisement> advertisements;
    
    @OneToMany(mappedBy = "staff")
    private List<Payroll> payrolls;
    
    @ManyToOne
    private Roster roster;
    
    @OneToOne(optional = false)
    private Address address;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Role role;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Department department;
    
    @OneToMany(mappedBy = "staff")
    private List<Review> repliedReviews;
    
    @OneToMany(mappedBy = "deliveryStaff")
    private List<Delivery> deliveries;

    public Staff() {
    }

    public Staff(String firstName, String lastName, Integer leaveRemaining, String nric, Role role, Department department) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.leaveRemaining = leaveRemaining;
        this.nric = nric;
        this.role = role;
        this.department = department;
    }
    
    
    
}
