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
public class CustomerCannotDeleteException extends Exception {

    /**
     * Creates a new instance of <code>CustomerCannotDeleteException</code>
     * without detail message.
     */
    public CustomerCannotDeleteException() {
    }

    /**
     * Constructs an instance of <code>CustomerCannotDeleteException</code> with
     * the specified detail message.
     *
     * @param msg the detail message.
     */
    public CustomerCannotDeleteException(String msg) {
        super(msg);
    }
}
