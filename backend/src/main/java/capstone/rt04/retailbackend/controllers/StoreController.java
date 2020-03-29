package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.StoreService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreCannotDeleteException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreUnableToUpdateException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.StoreControllerRoutes;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(StoreControllerRoutes.STORE_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Slf4j
public class StoreController {

    private final StoreService storeService;
    private final RelationshipService relationshipService;

    public StoreController(StoreService storeService, RelationshipService relationshipService) {
        this.storeService = storeService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(StoreControllerRoutes.CREATE_STORE)
    public ResponseEntity<?> createStore(@RequestBody Store store) throws InputDataValidationException, ProductVariantNotFoundException, WarehouseNotFoundException, StoreNotFoundException {
        Store newStore = storeService.createNewStore(store);
        return new ResponseEntity<>(newStore, HttpStatus.CREATED);
    }

    @GetMapping(StoreControllerRoutes.RETRIEVE_STORE_BY_ID)
    public ResponseEntity<?> retrieveStoreById(@PathVariable Long storeId) {
        try {
            Store store = storeService.retrieveStoreById(storeId);
            return new ResponseEntity<>(store, HttpStatus.OK);
        } catch (StoreNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(StoreControllerRoutes.RETRIEVE_ALL_STORES)
    public ResponseEntity<?> retrieveAllStores() {
        List<Store> stores = storeService.retrieveAllStores();
        stores.forEach(store -> relationshipService.clearStoreRelationships(store));
        return new ResponseEntity<>(stores, HttpStatus.OK);
    }


    @PostMapping(StoreControllerRoutes.UPDATE_STORE)
    public ResponseEntity<?> updateStore(@RequestBody Store existingStore) throws InputDataValidationException {
        try {
            Store updatedStore = storeService.updateStore(existingStore);
            return new ResponseEntity<>(updatedStore, HttpStatus.OK);
        } catch (StoreUnableToUpdateException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(StoreControllerRoutes.DELETE_STORE)
    public ResponseEntity<?> deleteStore(@PathVariable Long storeId) {
        try {
            Store deletedStore = storeService.deleteStore(storeId);
            return new ResponseEntity<>(deletedStore, HttpStatus.OK);
        } catch (StoreNotFoundException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (StoreCannotDeleteException ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
