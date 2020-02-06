/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
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
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long reviewId;

    @NotNull
    @Column(nullable = false, columnDefinition = "VARCHAR(1337)")
    @Size(max = 1337)
    private String content;

    @NotNull
    @Column(nullable = false)
    private Timestamp createdDateTime;

    @NotNull
    @Column(nullable = false)
    private Integer rating;

    private String response;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @NotNull
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Customer customer;

    @ManyToOne
    private Staff staff;

    public Review() {
        this.createdDateTime = new Timestamp(System.currentTimeMillis());
    }

    public Review(String content, Integer rating, Product product) {
        this();
        this.content = content;
        this.rating = rating;
        this.product = product;
    }

}
