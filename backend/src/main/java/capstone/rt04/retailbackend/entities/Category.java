/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
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
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long categoryId;
    
    @NotNull(message = "Category must have a name")
    @Column(nullable = false)
    private String name;
    
    @OneToMany(mappedBy = "category")
    private List<Product> products;
    
    @OneToMany(mappedBy = "parentCategory")
    private List<Category> childCategories;
    
    @ManyToOne
    private Category parentCategory;

    public Category() {
        this.products = new ArrayList<>();
    }

    public Category(String name) {
        this();
        this.name = name;
    }
    
}
