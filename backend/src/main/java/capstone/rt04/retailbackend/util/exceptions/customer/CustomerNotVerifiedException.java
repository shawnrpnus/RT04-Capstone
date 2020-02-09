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
public class CustomerNotVerifiedException extends Exception {

    /**
     * Creates a new instance of <code>CustomerCannotDeleteException</code>
     * without detail message.
     */
    public CustomerNotVerifiedException() {
    }

    /**
     * Constructs an instance of <code>CustomerCannotDeleteException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public CustomerNotVerifiedException(String msg) {
        super(msg);
    }
}
