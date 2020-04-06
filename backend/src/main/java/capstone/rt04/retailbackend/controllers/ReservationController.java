package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Reservation;
import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.request.customer.CreateReservationRequest;
import capstone.rt04.retailbackend.request.customer.UpdateReservationRequest;
import capstone.rt04.retailbackend.request.customer.UpdateReservationStatusRequest;
import capstone.rt04.retailbackend.response.ReservationStockCheckResponse;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.ReservationService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.reservation.ReservationNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.CustomerControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(CustomerControllerRoutes.RESERVATION_BASE_ROUTE)
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReservationController {

    private final ReservationService reservationService;
    private final ValidationService validationService;
    private final RelationshipService relationshipService;


    public ReservationController(ReservationService contactUsService, ValidationService validationService, RelationshipService relationshipService) {
        this.reservationService = contactUsService;
        this.validationService = validationService;
        this.relationshipService = relationshipService;
    }

    @PostMapping(CustomerControllerRoutes.CREATE_RESERVATION)
    public ResponseEntity<?> createNewReservation(@RequestBody CreateReservationRequest createReservationRequest) throws InputDataValidationException, StoreNotFoundException, CustomerNotFoundException, ProductVariantNotFoundException {

        validationService.throwExceptionIfInvalidBean(createReservationRequest);
        Reservation reservation = reservationService.
                createReservationFromReservationCart(createReservationRequest.getCustomerId(),
                        createReservationRequest.getStoreId(),
                        createReservationRequest.getReservationDateTime());
        clearReservationRelationships(reservation);
        return new ResponseEntity<>(reservation, HttpStatus.CREATED);
    }

    @GetMapping(CustomerControllerRoutes.GET_AVAIL_SLOTS_FOR_STORE)
    public List<ZonedDateTime> getAvailSlotsForStore(@RequestParam Long storeId) throws StoreNotFoundException {
        return reservationService.getAvailTimelotsForStore(storeId);
    }

    @GetMapping(CustomerControllerRoutes.GET_UPCOMING_RESERVATIONS)
    public List<Reservation> getUpcomingReservations(@RequestParam Long customerId) throws CustomerNotFoundException {
        List<Reservation> upcomingReservations = reservationService.getCustomerUpcomingReservations(customerId);
        upcomingReservations.forEach(this::clearReservationRelationships);
        return upcomingReservations;
    }

    @GetMapping(CustomerControllerRoutes.GET_PAST_RESERVATIONS)
    public List<Reservation> getPastReservations(@RequestParam Long customerId) throws CustomerNotFoundException {
        List<Reservation> pastReservations = reservationService.getCustomerPastReservations(customerId);
        pastReservations.forEach(this::clearReservationRelationships);
        return pastReservations;
    }

    @PostMapping(CustomerControllerRoutes.CANCEL_RESERVATION)
    public ResponseEntity<?> cancelReservation(@RequestParam Long reservationId) throws ReservationNotFoundException, InputDataValidationException {
        Reservation cancelledReservation = reservationService.cancelReservation(reservationId);
        clearReservationRelationships(cancelledReservation);
        return new ResponseEntity<>(cancelledReservation, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_RESERVATION)
    public ResponseEntity<?> updateReservation(@RequestBody UpdateReservationRequest req) throws InputDataValidationException, ProductVariantNotFoundException, ReservationNotFoundException, StoreNotFoundException {
        Reservation updatedReservation = reservationService.updateReservation(req.getReservationId(), req.getNewReservationDateTime(), req.getNewStoreId());
        clearReservationRelationships(updatedReservation);
        return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.GET_PROD_VARIANT_STORE_STOCK_STATUS_FOR_CART)
    public Map<Long, Map<String, Object>> getProdVariantStoreStockStatusForCart(@RequestParam Long customerId, @RequestParam Long storeId) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException {
        return reservationService.getProdVariantStoreStockStatusForCart(customerId, storeId);
    }

    @GetMapping(CustomerControllerRoutes.GET_PROD_VARIANT_STORE_STOCK_STATUS_FOR_RESERVATION)
    public Map<Long, Map<String, Object>> getProdVariantStoreStockStatusForReservation(@RequestParam Long reservationId, @RequestParam Long storeId) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException, ReservationNotFoundException {
        return reservationService.getProdVariantStoreStockStatusForReservation(reservationId, storeId);
    }

    @GetMapping(CustomerControllerRoutes.GET_STORES_STOCK_STATUS_FOR_CART)
    public ResponseEntity<?> getStoresStockStatusForCart(@RequestParam Long customerId) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException {
        List<ReservationStockCheckResponse> reservationStockCheckResponses = reservationService.getAllStoresStockStatusForCart(customerId);
        reservationStockCheckResponses.forEach(this::clearReservationStockCheckResponseRelationships);
        return new ResponseEntity<>(reservationStockCheckResponses, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.GET_STORES_STOCK_STATUS_FOR_RESERVATION)
    public ResponseEntity<?> getStoresStockStatusForReservation(@RequestParam Long reservationId) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException, ReservationNotFoundException {
        List<ReservationStockCheckResponse> reservationStockCheckResponses = reservationService.getAllStoresStockStatusForReservation(reservationId);
        reservationStockCheckResponses.forEach(this::clearReservationStockCheckResponseRelationships);
        return new ResponseEntity<>(reservationStockCheckResponses, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.RETRIEVE_RESERVATION_BY_ID)
    public ResponseEntity<?> retrieveReservationById(@RequestParam Long reservationId) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException, ReservationNotFoundException {
        Reservation reservation = reservationService.retrieveReservationByReservationId(reservationId);
        clearReservationRelationships(reservation);
        return new ResponseEntity<>(reservation, HttpStatus.OK);
    }

    @GetMapping(CustomerControllerRoutes.GET_RESERVATIONS_FOR_STORE)
    public ResponseEntity<?> getReservationsForStore(@RequestParam Long storeId) {
        List<Reservation> reservations = reservationService.getUpcomingReservationsForStore(storeId);
        reservations.forEach(this::clearReservationRelationships);
        reservations.sort((r1, r2) ->
                r1.getReservationDateTime().equals(r2.getReservationDateTime())
                ? 0
                : r1.getReservationDateTime().before(r2.getReservationDateTime())
                ? -1 : 1);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @PostMapping(CustomerControllerRoutes.UPDATE_RESERVATION_STATUS)
    public ResponseEntity<?> updateReservationStatus(@RequestBody UpdateReservationStatusRequest req) throws ReservationNotFoundException {
        Reservation reservation = reservationService.updateReservationStatus(req.getReservationId(), req.getIsHandled(), req.getIsAttended());
        clearReservationRelationships(reservation);
        return new ResponseEntity<>(reservation, HttpStatus.OK);
    }


    private void clearReservationStockCheckResponseRelationships(ReservationStockCheckResponse rscp) {
        Store store = rscp.getStore();
        store.setProductStocks(null);
        store.setInStoreRestockOrders(null);
        store.setReservations(null);
        store.setStaff(null);
        store.setTransactions(null);

    }


    private void clearReservationRelationships(Reservation reservation) {
        if (reservation.getProductVariants() != null) {
            for (ProductVariant pv : reservation.getProductVariants()) {
                relationshipService.clearCustomerReservationOrWishlist(pv);
            }
        }
        if (reservation.getCustomer() != null) {
            reservation.getCustomer().setPassword(null);
            reservation.getCustomer().setVerificationCode(null);
            reservation.getCustomer().setInStoreShoppingCart(null);
            reservation.getCustomer().setOnlineShoppingCart(null);
            reservation.getCustomer().setWishlistItems(null);
            reservation.getCustomer().setReservationCartItems(null);
            reservation.getCustomer().setReservations(null);
            reservation.getCustomer().setTransactions(null);
            reservation.getCustomer().setStyle(null);
            reservation.getCustomer().setReviews(null);
            reservation.getCustomer().setCreditCards(null);
            reservation.getCustomer().setShippingAddresses(null);
            reservation.getCustomer().setUsedPromoCodes(null);
        }
        if (reservation.getStore() != null) {
            relationshipService.clearStoreRelationships(reservation.getStore());
        }
    }
}
