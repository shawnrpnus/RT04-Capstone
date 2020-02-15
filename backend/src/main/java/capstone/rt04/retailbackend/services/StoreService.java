package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.InStoreRestockOrderRepository;
import capstone.rt04.retailbackend.repositories.StoreRepository;
import capstone.rt04.retailbackend.util.enums.DeliveryStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.CreateNewProductStockException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreUnableToUpdateException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class StoreService {

    @Autowired
    private final ValidationService validationService;
    private final ProductService productService;

    private final StoreRepository storeRepository;
    private final InStoreRestockOrderRepository inStoreRestockOrderRepository;

    public StoreService(ValidationService validationService, @Lazy ProductService productService, StoreRepository storeRepository, InStoreRestockOrderRepository inStoreRestockOrderRepository) {
        this.validationService = validationService;
        this.productService = productService;
        this.storeRepository = storeRepository;
        this.inStoreRestockOrderRepository = inStoreRestockOrderRepository;
    }

    public Store createNewStore(Store store) throws CreateNewProductStockException, WarehouseNotFoundException, InputDataValidationException {
            Map<String, String> errorMap = validationService.generateErrorMap(store);

            if (errorMap == null) {
                storeRepository.save(store);
                List<Store> stores = new ArrayList<>();
                stores.add(store);
                productService.assignProductStock(null, stores);
            }  else {
                throw new InputDataValidationException(errorMap, "Invalid data");
            }
            return store;
    }

    public Store retrieveStoreById(Long storeId) throws StoreNotFoundException {
        if (storeId == null) {
            throw new StoreNotFoundException("Store ID not provided");
        }

        return storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException("Store with id: " + storeId + " does not exist"));
    }

    public List<Store> retrieveAllStores() {
        List<Store> allStores = storeRepository.findAll();

        for (Store store : allStores) {
            store.getReservations().size();
            store.getInStoreRestockOrders().size();
            store.getProductStocks().size();
            store.getTransactions().size();
            store.getRosters().size();
        }
        return allStores;
    }

    //edit store details: update existing store information
    //numChangingRooms, openingTime, closingTime, numManagers, numAssistants, address
    public Store updateStore(Store store) throws StoreUnableToUpdateException {
        try {
            Store storeToUpdate = retrieveStoreById(store.getStoreId());
            if (storeToUpdate.equals(store)) {
                throw new StoreUnableToUpdateException("Store has nothing to update");
            }
            //Integer: numChangingRooms, numManagers, numAssistants
            if (storeToUpdate.getNumChangingRooms() != store.getNumChangingRooms()) {
                storeToUpdate.setNumChangingRooms(store.getNumChangingRooms());
            }
            if (storeToUpdate.getNumAssistants() != store.getNumAssistants()) {
                storeToUpdate.setNumAssistants(store.getNumAssistants());
            }
            if(storeToUpdate.getNumManagers() != store.getNumManagers()) {
                storeToUpdate.setNumManagers(store.getNumManagers());
            }
            //Time: openingTime, closingTime
            if (!storeToUpdate.getOpeningTime().toString().equals(store.getOpeningTime().toString())) {
                storeToUpdate.setOpeningTime(store.getOpeningTime());
            }
            if (!storeToUpdate.getClosingTime().toString().equals(store.getClosingTime().toString())) {
                storeToUpdate.setClosingTime(store.getClosingTime());
            }
            //Address
            if (!storeToUpdate.getAddress().equals(store.getAddress())) {
                storeToUpdate.setAddress(store.getAddress());
            }
            storeRepository.save(storeToUpdate);
            return storeToUpdate;
        } catch (StoreNotFoundException ex) {
            throw new StoreUnableToUpdateException("Unable to update store as store cannot be found");
        }

    }

    public Store deleteStore(Long storeId) throws StoreNotFoundException, StoreCannotDeleteException {
        /*
        store cannot be deleted if:
        i) there are reservations unhandled
        ii) there are in-store restock orders that are PROCESSING/IN-TRANSIT
        iii) there are product stocks
         */
        Store storeToDelete = retrieveStoreById(storeId);

        //check if there are reservations associated with store
        //if there are reservations associated, check if they are handled
        if (storeToDelete.getReservations() != null && storeToDelete.getReservations().size() > 0) {
            for (Reservation reservation: storeToDelete.getReservations()) {
                if (!reservation.isHandled()) {
                    throw new StoreCannotDeleteException("Store cannot be deleted as there are reservations "
                            + "that are not handled yet");
                }
            }
        }
        //check if there are in-store restock orders
        //if there are RO, check if they are PROCESSING/IN-TRANSIT
        if (storeToDelete.getInStoreRestockOrders() != null && storeToDelete.getInStoreRestockOrders().size() > 0) {
            for (InStoreRestockOrder inStoreRestockOrder: storeToDelete.getInStoreRestockOrders()) {
                if (inStoreRestockOrder.getDeliveryStatus() == DeliveryStatusEnum.PROCESSING
                || inStoreRestockOrder.getDeliveryStatus() == DeliveryStatusEnum.IN_TRANSIT) {
                    throw new StoreCannotDeleteException("Store cannot be deleted as there are in store restock " +
                            "orders that are processing/in-transit");
                }
            }
        }

        if (storeToDelete.getProductStocks() != null && storeToDelete.getProductStocks().size() > 0) {
            for (ProductStock productStock: storeToDelete.getProductStocks()) {
                if (productStock.getQuantity() > 0) {
                    throw new StoreCannotDeleteException("Store cannot be deleted as there are product stocks in store");
                }
            }
        }

        //clear r/s with RO & delete RO
        for (InStoreRestockOrder ro : storeToDelete.getInStoreRestockOrders()) {
            ro.getInStoreRestockOrderItems().clear();
            List<Delivery> deliveries = ro.getDeliveries();
            for (Delivery delivery: deliveries) {
                delivery.getInStoreRestockOrders().remove(ro);
            }
            ro.setDeliveries(null);
            ro.getWarehouse().getInStoreRestockOrders().remove(ro);
            ro.setWarehouse(null);
            inStoreRestockOrderRepository.delete(ro);
        }
        storeToDelete.setInStoreRestockOrders(null);

        //clear r/s with reservations
        for (Reservation r: storeToDelete.getReservations()) {
            r.setStore(null);
        }

        storeToDelete.setReservations(null);

        storeRepository.delete(storeToDelete);
        return storeToDelete;
    }

}
