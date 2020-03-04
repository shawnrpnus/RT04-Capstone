/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import capstone.rt04.retailbackend.util.ErrorMessages;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.voodoodyne.jackson.jsog.JSOGGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
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
@ToString(exclude = {"category"})
@JsonIdentityInfo(generator = JSOGGenerator.class)
@JsonDeserialize()
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotNull (message = ErrorMessages.SERIAL_NUMBER_REQUIRED)
    @Column(nullable = false, unique = true)
    @Size(min = 5, message = ErrorMessages.SERIAL_NUMBER_REQUIRED)
    private String serialNumber;

    @NotNull (message = ErrorMessages.PRODUCT_NAME_REQUIRED)
    @Column(nullable = false)
    @Size(min = 0, message = ErrorMessages.PRODUCT_NAME_REQUIRED)
    private String productName;

    @NotNull (message = ErrorMessages.DESCRIPTION_REQUIRED)
    @Column(nullable = false, columnDefinition = "VARCHAR(1337)")
    @Size(max = 1337, message = ErrorMessages.DESCRIPTION_REQUIRED)
    private String description;

    @NotNull (message = ErrorMessages.PRICE_REQUIRED)
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin(value = "0.00", message = ErrorMessages.PRICE_REQUIRED)
    private BigDecimal price;

    @NotNull (message = ErrorMessages.COST_REQUIRED)
    @Column(nullable = false, precision = 11, scale = 2)
    @DecimalMin(value = "0.00", message = ErrorMessages.COST_REQUIRED)
    private BigDecimal cost;

    @ManyToMany(mappedBy = "products")
    private List<Discount> discounts;

    @ManyToMany(mappedBy = "products")
    private List<PromoCode> promoCodes;

    @ManyToMany(mappedBy = "products")
    private List<Tag> tags;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @NotNull (message = ErrorMessages.CATEGORY_REQUIRED)
    private Category category;

    @OneToMany(mappedBy = "product")
    private List<Review> reviews;

    @OneToMany(mappedBy = "product")
    private List<ProductVariant> productVariants;

    @ManyToMany(mappedBy = "products")
    private List<Style> styles;


    public Product() {
        this.discounts = new ArrayList<>();
        this.promoCodes = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.productVariants = new ArrayList<>();
        this.styles = new ArrayList<>();
    }

    public Product(String serialNumber, String productName, String description, BigDecimal price, BigDecimal cost) {
        this();
        this.serialNumber = serialNumber;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.cost = cost;
    }

    public void addTag(Tag tag)
    {
        if(tag != null)
        {
            if(!this.tags.contains(tag))
            {
                this.tags.add(tag);

                if(!tag.getProducts().contains(this))
                {
                    tag.getProducts().add(this);
                }
            }
        }
    }

    public void addStyle(Style style)
    {
        if(style != null)
        {
            if(!this.styles.contains(style))
            {
                this.styles.add(style);

                if(!style.getProducts().contains(this))
                {
                    style.getProducts().add(this);
                }
            }
        }
    }
}
