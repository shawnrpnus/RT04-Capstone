/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.ErrorMessages;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
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
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Staff implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long staffId;

    @NotNull (message = ErrorMessages.FIRST_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min = 1, message = ErrorMessages.FIRST_NAME_REQUIRED )
    private String firstName;

    @NotNull (message = ErrorMessages.LAST_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min =1 , message =ErrorMessages.LAST_NAME_REQUIRED)
    private String lastName;

    @Size
    private String username;

    @NotNull(message = ErrorMessages.EMAIL_REQUIRED)
    @Column(nullable = false, unique = true)
    @Email(message = ErrorMessages.EMAIL_INVALID)
    @Size(min =1 , message =ErrorMessages.EMAIL_REQUIRED)
    private String email;



    @Size(min = 6)
    private String password;

    @NotNull
    @Column(nullable = false)
    private Integer leaveRemaining;

    @NotNull
    @Column(nullable = false)
    @Size(min =1 , message =ErrorMessages.NRIC_REQUIRED)
    private String nric;

    @NotNull (message =ErrorMessages.SALARY_REQUIRED)
    @Column(nullable = false)
    private BigDecimal salary;

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
        this.deliveries = new ArrayList<>();
        this.repliedReviews = new ArrayList<>();
        this.payrolls = new ArrayList<>();
        this.advertisements = new ArrayList<>();
        this.leaves = new ArrayList<>();
    }

    public Staff(String firstName, String lastName, Integer leaveRemaining, String nric, String email, BigDecimal salary) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.leaveRemaining = leaveRemaining;
        this.nric = nric;
        this.email = email;
        this.salary = salary;
    }



}
