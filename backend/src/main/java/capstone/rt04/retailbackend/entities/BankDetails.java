/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Embeddable;
import java.io.Serializable;

/**
 *
 * @author shawn
 */
@Embeddable
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class BankDetails implements Serializable {

    private String branchNumber;
    
    private String accountNumber;

}
