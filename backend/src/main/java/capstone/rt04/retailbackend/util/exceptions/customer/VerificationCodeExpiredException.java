/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.exceptions.customer;

/**
 *
 * @author shawn
 */
public class VerificationCodeExpiredException extends Exception {

    public VerificationCodeExpiredException() {
    }

    public VerificationCodeExpiredException(String msg) {
        super(msg);
    }
}
