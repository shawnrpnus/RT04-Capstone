/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.enums;

/**
 *
 * @author shawn
 */
public enum SizeEnum {
    XXS(0),
    XS(1),
    S(2),
    M(3),
    L(4),
    XL(5),
    XXL(6);

    public final Integer value;

    SizeEnum(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return this.value;
    }
}
