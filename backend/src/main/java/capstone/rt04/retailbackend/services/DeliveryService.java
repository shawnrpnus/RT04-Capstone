package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Delivery;
import capstone.rt04.retailbackend.entities.InStoreRestockOrder;
import capstone.rt04.retailbackend.entities.InStoreRestockOrderItem;
import capstone.rt04.retailbackend.entities.Staff;
import capstone.rt04.retailbackend.repositories.DeliveryRepository;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.enums.ItemDeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    private final StaffService staffService;
    private final InStoreRestockOrderService inStoreRestockOrderService;

    public DeliveryService(DeliveryRepository deliveryRepository, StaffService staffService, @Lazy InStoreRestockOrderService inStoreRestockOrderService) {
        this.deliveryRepository = deliveryRepository;
        this.inStoreRestockOrderService = inStoreRestockOrderService;
        this.staffService = staffService;
    }

    public Delivery retrieveDeliveryById(Long deliveryId) throws DeliveryNotFoundException {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery " + deliveryId + "not found!"));
        return delivery;
    }

    public List<Delivery> retrieveAllDelivery() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        return deliveries;
    }


    // deliverRestockOrderItem
    public void createDeliveryForRestockOrder(List<Long> inStoreRestockOrderItemIds, Long staffId) throws InStoreRestockOrderItemNotFoundException, StaffNotFoundException {
        List<InStoreRestockOrderItem> inStoreRestockOrderItems = new ArrayList<>();
        InStoreRestockOrderItem inStoreRestockOrderItem = new InStoreRestockOrderItem();
        for (Long id : inStoreRestockOrderItemIds) {
            inStoreRestockOrderItem = inStoreRestockOrderService.retrieveInStoreRestockOrderItemById(id);
            inStoreRestockOrderItem.setItemDeliveryStatus(ItemDeliveryStatusEnum.IN_TRANSIT);
            inStoreRestockOrderItems.add(inStoreRestockOrderItem);
        }
        InStoreRestockOrder inStoreRestockOrder = inStoreRestockOrderItem.getInStoreRestockOrder();
        DeliveryStatusEnum deliveryStatusEnum = inStoreRestockOrder.getDeliveryStatus();

        // if delivery is partially fulfilled, don't update delivery status anymore
        if (inStoreRestockOrder.getDeliveryStatus().equals(DeliveryStatusEnum.PARTIALLY_FULFILLED)) {
        } else if (deliveryStatusEnum.equals(DeliveryStatusEnum.PARTIALLY_TO_BE_DELIVERED))
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.PARTIALLY_IN_TRANSIT);
        else if (deliveryStatusEnum.equals(DeliveryStatusEnum.TO_BE_DELIVERED))
            inStoreRestockOrder.setDeliveryStatus(DeliveryStatusEnum.IN_TRANSIT);

        Staff staff = staffService.retrieveStaffByStaffId(staffId);
        Delivery delivery = new Delivery(new Timestamp(System.currentTimeMillis()), staff);
        delivery.getInStoreRestockOrderItems().addAll(inStoreRestockOrderItems);
        inStoreRestockOrderItems.forEach(item -> item.setDelivery(delivery));
        deliveryRepository.save(delivery);
    }

    // For delivering products from online shopping
    public void deliverCustomerOrder() {

    }


}
