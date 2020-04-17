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
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
public class Style implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long styleId;

    @NotNull(message = ErrorMessages.STYLE_NAME_REQUIRED)
    @Column(unique = true)
    private String styleName;

    @ManyToMany
    private List<Product> products;

    @OneToMany(mappedBy = "style")
    private List<Customer> customers;

    private String stylePreference;
    private String gender;

    @ElementCollection
    private List<String> questions;

    @ElementCollection
    private Map<String, String> answers; //key is question, value is answer

    public Style() {
        this.products = new ArrayList<>();
        this.customers = new ArrayList<>();
        this.stylePreference = "";
        this.gender = "";
    }

    public Style(String name) {
        this();
        this.styleName = name;
    }

    public Style(String name, List<Product> products) {
        this();
        this.styleName = name;
        this.products = products;
    }

}
