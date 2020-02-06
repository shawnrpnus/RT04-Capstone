/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import capstone.rt04.retailbackend.util.enums.RoleNameEnum;

/**
 *
 * @author shawn
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long roleId;
    
    private RoleNameEnum roleName;
    
    private BigDecimal baseSalary;
    
    @OneToMany(mappedBy = "role")
    private List<Staff> staffList;

    public Role() {
    }
    
    public Role(RoleNameEnum roleName, BigDecimal baseSalary) {
        this.roleName = roleName;
        this.baseSalary = baseSalary;
    }
     
}
