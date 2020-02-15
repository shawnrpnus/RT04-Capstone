/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.Constants;
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

    @ManyToMany(mappedBy = "preferredStyles")
    private List<Customer> customers;

    public Style() {

        this.products = new ArrayList<>();
        this.customers = new ArrayList<>();
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
