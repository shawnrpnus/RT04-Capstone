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
public class VerificationCode implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long verificationCodeId;

    @NotNull
    @Column(unique = true)
    private String code;

    @NotNull
    private Timestamp expiryDateTime;

    @NotNull
    @OneToOne(mappedBy = "verificationCode" , optional = false)
    private Customer customer;


    public VerificationCode() {
    }

    public VerificationCode(String code, Timestamp expiryDateTime, Customer customer) {
        this.code = code;
        this.expiryDateTime = expiryDateTime;
        this.customer = customer;
    }


}
