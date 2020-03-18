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
// @ToString
@JsonIdentityInfo(generator = JSOGGenerator.class)
public class InstagramPost implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long instagramPostId;

    @Size(max = 500)
    @NotNull(message = "Instagram image URL must be provided")
    private String instagramImgUrl;

    @NotNull(message = "Active status must be specified")
    private Boolean active;

    @Size(max = 1000)
    private String caption;

    @Column(unique = true)
    @Size(max = 20)
    @NotNull(message = "Short code must be specified")
    private String shortCode;

    @ManyToMany
    private List<Product> associatedProducts;

    public InstagramPost() {
        this.associatedProducts = new ArrayList<>();
        this.active = Boolean.FALSE;
    }

    public InstagramPost(String shortCode, String instagramImgUrl, String caption) {
        this();
        this.shortCode = shortCode;
        this.instagramImgUrl = instagramImgUrl;
        this.caption = caption;
    }

}
