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
public class Advertisement implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long advertisementId;
    
    @NotNull
    @Column(nullable = false)
    private String advertisementImgUrl;
    
//    private Timestamp fromDateTime;
//    private Timestamp toDateTime;

    private Boolean active;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff creator;

    public Advertisement() {
    }

    public Advertisement(String advertisementImgUrl, Staff creator) {
        this.advertisementImgUrl = advertisementImgUrl;
        this.creator = creator;
    }
     
}
