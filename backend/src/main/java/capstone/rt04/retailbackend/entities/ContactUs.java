/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import capstone.rt04.retailbackend.util.enums.ContactUsCategoryEnum;

/**
 *
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
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
    private String content;
    
    @NotNull
    @Column(nullable = false)
    private String customerEmail;
    
    private boolean acknowledged;

    public ContactUs() {
        this.acknowledged = false;
    }

    public ContactUs(ContactUsCategoryEnum contactUsCategory, String content, String customerEmail) {
        this();
        this.contactUsCategory = contactUsCategory;
        this.content = content;
        this.customerEmail = customerEmail;
    }
         
}
