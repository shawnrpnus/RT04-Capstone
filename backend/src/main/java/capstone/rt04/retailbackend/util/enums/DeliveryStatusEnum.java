/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.enums;

/**
 * @author shawn
 */
public enum DeliveryStatusEnum {
    PROCESSING,

    TO_BE_DELIVERED, // when all the item is marked to be delivered
    PARTIALLY_TO_BE_DELIVERED, // when some item in the order is marked to be delivered

    IN_TRANSIT, // when all item is ins transit
    PARTIALLY_IN_TRANSIT, // when some item in the order is in transit

    DELIVERED, // when all item is fulfilled
    PARTIALLY_FULFILLED, // when some item in the order is fulfilled

    FAILED,

    READY_FOR_COLLECTION,
    COLLECTED
}
