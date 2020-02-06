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
public class CustomerEmailExistsException extends Exception {

    /**
     * Creates a new instance of <code>CustomerEmailExistsException</code>
     * without detail message.
     */
    public CustomerEmailExistsException() {
    }

    /**
     * Constructs an instance of <code>CustomerEmailExistsException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public CustomerEmailExistsException(String msg) {
        super(msg);
    }
}
