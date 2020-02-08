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
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
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
        property = "staffId")
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
