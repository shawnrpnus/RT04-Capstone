/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
public class Advertisement implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long advertisementId;
    
    @NotNull
    @Column(nullable = false)
    private String fileName;
    
    private Timestamp fromDateTime;
    
    private Timestamp toDateTime;
    
    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Staff creator;

    public Advertisement() {
    }

    public Advertisement(String fileName, Staff creator) {
        this.fileName = fileName;
        this.creator = creator;
    }
     
}
