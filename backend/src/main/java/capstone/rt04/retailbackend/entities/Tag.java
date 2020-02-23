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
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString(exclude = "products")
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long tagId;

    @NotNull(message = ErrorMessages.TAG_NAME_REQUIRED)
    @Column(unique = true)
    @Size(min = 1, message = "Tag categoryName is required")
    private String name;

    @ManyToMany
    private List<Product> products;

    public Tag() {
        this.products = new ArrayList<>();
    }

    public Tag(String name) {
        this();
        this.name = name;
    }

    public Tag(String name, List<Product> products) {
        this.name = name;
        this.products = products;
    }

}
