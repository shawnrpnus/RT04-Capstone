package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.ProductVariant;
import capstone.rt04.retailbackend.entities.Reservation;
import capstone.rt04.retailbackend.entities.Store;
import capstone.rt04.retailbackend.repositories.ReservationRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.reservation.ReservationNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import org.springframework.cglib.core.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class ReservationService {

    private final String BEFORE = "before";
    private final String AFTER = "after";

    private final CustomerService customerService;
    private final ProductService productService;
    private final StoreService storeService;
    private final ValidationService validationService;

    private final ReservationRepository reservationRepository;

    public ReservationService(CustomerService customerService, ProductService productService, StoreService storeService, ValidationService validationService, ReservationRepository reservationRepository) {
        this.customerService = customerService;
        this.productService = productService;
        this.storeService = storeService;
        this.validationService = validationService;
        this.reservationRepository = reservationRepository;
    }

    //dateTime must be in format 'YYYY-MM-DD hh:mm:ss'
    public Reservation createReservationFromReservationCart(Long customerId, Long storeId, String dateTime) throws CustomerNotFoundException, StoreNotFoundException, InputDataValidationException {
        //check between 1 and 48h in advance
        Timestamp reservationDateTime = checkReservationTiming(dateTime);

        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        Store store = storeService.retrieveStoreById(storeId);
        List<ProductVariant> productVariants = customer.getReservationCartItems();

        // TODO: check if store has stock for productVariants

        Reservation reservation = new Reservation(reservationDateTime, productVariants, customer, store);
        store.getReservations().add(reservation);
        customer.getReservations().add(reservation);

        // TODO: Deduct from store's product stock

        return reservationRepository.save(reservation);
    }

    public Reservation retrieveReservationByReservationId(Long reservationId) throws ReservationNotFoundException {
        return reservationRepository.findById(reservationId).orElseThrow(
                () -> new ReservationNotFoundException("Reservation with id: " + reservationId + " does not exist!")
        );
    }

    public List<Reservation> getCustomerUpcomingReservations(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        List<Reservation> result = new ArrayList<>(customer.getReservations());

        // get reservations after current time
        CollectionUtils.filter(result, r -> ((Reservation) r).getReservationDateTime().after(new Timestamp(System.currentTimeMillis())));
        //earliest one first
        result.sort((Reservation r1, Reservation r2) -> r1.getReservationDateTime().before(r2.getReservationDateTime()) ? -1 : 1);

        return result;
    }

    public List<Reservation> getCustomerPastReservations(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        List<Reservation> result = new ArrayList<>(customer.getReservations());

        // get reservations after current time
        CollectionUtils.filter(result, r -> ((Reservation) r).getReservationDateTime().before(new Timestamp(System.currentTimeMillis())));
        //most recent one first
        result.sort((Reservation r1, Reservation r2) -> r1.getReservationDateTime().after(r2.getReservationDateTime()) ? -1 : 1);

        return result;
    }

    // for customer to update time, store
    public Reservation updateReservation(Long reservationId, String newReservationDateTime, Store newStore) throws ReservationNotFoundException, InputDataValidationException {
        Reservation reservationToUpdate = retrieveReservationByReservationId(reservationId);

        // only can cancel if more than 15mins before


        //cannot edit past reservations
        if (reservationToUpdate.getReservationDateTime().before(new Timestamp(System.currentTimeMillis()))){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("reservationDateTime", "You cannot edit past reservations");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }

        //check between 1 and 48 hours in advance
        Timestamp newDateTime = checkReservationTiming(newReservationDateTime);

        // TODO: before update store check that all are in stock
        // TODO: Update store
        // TODO: after update store, add to prev store stock, deduct from new store's stock

        return null;
    }

    public Reservation cancelReservation(Long reservationId) throws ReservationNotFoundException {
        Reservation reservationToCancel = retrieveReservationByReservationId(reservationId);

        reservationToCancel.setCustomer(null);
        reservationToCancel.getCustomer().getReservations().remove(reservationToCancel);

        List<ProductVariant> productVariants = reservationToCancel.getProductVariants();
        Store store = reservationToCancel.getStore();

        // TODO: Increment stock for productVariants in the store
        store.getReservations().remove(reservationToCancel);
        reservationToCancel.setStore(null);

        reservationToCancel.setProductVariants(null);

        reservationRepository.delete(reservationToCancel);

        return reservationToCancel;
    }

    private Timestamp checkReservationTiming(String reservationDateTime) throws InputDataValidationException {
        Timestamp dateTime = Timestamp.valueOf(reservationDateTime);
        long now = System.currentTimeMillis();
        long nowPlus1Hour = now + TimeUnit.HOURS.toMillis(1);
        long nowPlus24Hour = now + TimeUnit.HOURS.toMillis(48);
        Map<String, String> errorMap = new HashMap<>();
        // make sure at least 1h in advance and no more than 48 in advance
        if(!(dateTime.after(new Timestamp(nowPlus1Hour)) && dateTime.before(new Timestamp(nowPlus24Hour)))){
            errorMap.put("reservationDateTime", "Reservation must be between 1 to 48 hours in advance");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }
        return dateTime;
    }

}
