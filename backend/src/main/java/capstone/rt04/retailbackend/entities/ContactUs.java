/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.ErrorMessages;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;
import capstone.rt04.retailbackend.util.enums.ContactUsStatusEnum;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class ContactUs implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long contactUsId;

    @NotNull
    @Column(nullable = false)
    private ContactUsCategoryEnum contactUsCategory;

    @NotNull
    @Column(nullable = false, columnDefinition = "VARCHAR(1337)")
    @Size(max = 1337)
    @NotEmpty
    private String content;

    @NotNull(message = ErrorMessages.FIRST_NAME_REQUIRED)
    @Column(nullable = false)
    @NotEmpty(message = ErrorMessages.FIRST_NAME_REQUIRED)
    private String firstName;

    @NotNull(message = ErrorMessages.LAST_NAME_REQUIRED)
    @NotEmpty(message = ErrorMessages.LAST_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(max = 20)
    private String lastName;

    @NotNull(message = ErrorMessages.EMAIL_REQUIRED)
    @Column(nullable = false)
    @NotEmpty(message = ErrorMessages.EMAIL_REQUIRED)
    private String customerEmail;

    @NotNull(message = ErrorMessages.STATUS_REQUIRED)
    private ContactUsStatusEnum status;

    public ContactUs() {
        this.status = ContactUsStatusEnum.PENDING_ACTION;
    }

    public ContactUs(ContactUsCategoryEnum contactUsCategory, String content, String customerEmail, String firstName, String lastName) {
        this();
        this.contactUsCategory = contactUsCategory;
        this.content = content;
        this.customerEmail = customerEmail;
        this.firstName = firstName;
        this.lastName = lastName;
    }


}
