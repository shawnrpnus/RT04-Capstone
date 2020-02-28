/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.exceptions.customer;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 *
 * @author shawn
 */
@Getter
@Setter
public class CustomerNotVerifiedException extends Exception {

    Map<String, String> errorMap;

    public CustomerNotVerifiedException() {
    }

    public CustomerNotVerifiedException(Map<String, String> errorMap, String message) {
        super(message);
        this.errorMap = errorMap;
    }

    public CustomerNotVerifiedException(String msg) {
        super(msg);
    }
}
