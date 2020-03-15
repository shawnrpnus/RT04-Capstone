/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.enums;

public enum ItemDeliveryStatusEnum {
    PROCESSING,
    TO_BE_DELIVERED,
    IN_TRANSIT, // when all item is ins transit
    DELIVERED,
    DELAYED
}
