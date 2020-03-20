package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ReservationRepository;
import capstone.rt04.retailbackend.response.ReservationStockCheckResponse;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.reservation.CreateNewReservationException;
import capstone.rt04.retailbackend.util.exceptions.reservation.ReservationNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import com.fasterxml.jackson.datatype.jsr310.ser.ZonedDateTimeSerializer;
import org.springframework.cglib.core.CollectionUtils;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
    public Reservation createReservationFromReservationCart(Long customerId, Long storeId, String dateTime) throws CustomerNotFoundException, StoreNotFoundException, InputDataValidationException, ProductVariantNotFoundException {
        //check between 1 and 48h in advance
        //Timestamp always in UTC
        //String comes in Singapore time +0800
        Timestamp reservationDateTime = checkReservationTiming(dateTime);

        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        Store store = storeService.retrieveStoreById(storeId);
        List<ProductVariant> productVariants = customer.getReservationCartItems();
        if (productVariants == null || productVariants.isEmpty()) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("reservationCartItems", "Reservation cart is empty!");
            throw new InputDataValidationException(errorMap, errorMap.get("reservationCartItems"));
        }

        // check if store has stock for productVariants
        for (ProductVariant pv : productVariants) {
            //throw error when stock <= 0
            checkStoreStockForProductVariant(storeId, pv.getProductVariantId());
        }

        // check reservationDateTime not taken at store
        List<Timestamp> reservedTimeSlots = getReservedTimeslotsForStore(storeId);
        if (reservedTimeSlots.contains(reservationDateTime)) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("reservationDateTime","This time slot is already taken at " + store.getStoreName());
            throw new InputDataValidationException(errorMap, errorMap.get("reservationDateTime"));
        }

        Reservation reservation = new Reservation(reservationDateTime, productVariants, customer, store);
        store.getReservations().add(reservation);
        customer.getReservations().add(reservation);

        //Clear reservation cart
        customer.setReservationCartItems(new ArrayList<>());

        // Deduct from store's product stock
        for (ProductVariant pv : productVariants) {
            ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(storeId, pv.getProductVariantId());
            productStock.setQuantity(productStock.getQuantity() - 1);
        }

        return reservationRepository.save(reservation);
    }


    public Reservation retrieveReservationByReservationId(Long reservationId) throws ReservationNotFoundException {
        return reservationRepository.findById(reservationId).orElseThrow(
                () -> new ReservationNotFoundException("Reservation with id: " + reservationId + " does not exist!")
        );
    }

    public List<Timestamp> getReservedTimeslotsForStore(Long storeId) throws StoreNotFoundException {
        Store store = storeService.retrieveStoreById(storeId);
        List<Reservation> reservations = store.getReservations();
        List<Timestamp> result = new ArrayList<>();
        if (reservations != null) {
            for (Reservation reservation : reservations) {
                if (isTimestampFromNowTo48h(reservation.getReservationDateTime())) {
                    result.add(reservation.getReservationDateTime());
                }
            }
        }
        return result;
    }

    public List<ZonedDateTime> getAvailTimelotsForStore(Long storeId) throws StoreNotFoundException {
        Store store = storeService.retrieveStoreById(storeId);
        List<ZonedDateTime> result = new ArrayList<>();
        List<Timestamp> reservedSlots = getReservedTimeslotsForStore(storeId);

        LocalTime openingTime = store.getOpeningTime().toLocalTime();
        LocalTime closingTime = store.getClosingTime().toLocalTime();

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Singapore"));
        ZonedDateTime nowPlus1Hour = now.plusHours(1);
        nowPlus1Hour = nowPlus1Hour.truncatedTo(ChronoUnit.HOURS).plusMinutes((15 * ((nowPlus1Hour.getMinute()) / 15)) + 15);
        ZonedDateTime nowPlus48Hour = now.plusHours(48);
        nowPlus48Hour = nowPlus48Hour.truncatedTo(ChronoUnit.HOURS).plusMinutes((15 * ((nowPlus1Hour.getMinute()) / 15)));

        List<ZonedDateTime> reservedZoneDateTimes = new ArrayList<>();
        for (Timestamp reservedTimestamp : reservedSlots) {
            reservedZoneDateTimes.add(ZonedDateTime.ofInstant(reservedTimestamp.toInstant(), now.getZone()));
        }

        while (nowPlus1Hour.isBefore(nowPlus48Hour)) {
            LocalTime localTimeToCheck = LocalTime.of(nowPlus1Hour.getHour(), nowPlus1Hour.getMinute());
            if (localTimeToCheck.isAfter(openingTime) && localTimeToCheck.isBefore(closingTime)
                    && !reservedZoneDateTimes.contains(nowPlus1Hour)) {
                result.add(nowPlus1Hour);
            }
            nowPlus1Hour = nowPlus1Hour.plusMinutes(15);
        }
        return result;
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
    public Reservation updateReservation(Long reservationId, String newReservationDateTime, Long newStoreId) throws ReservationNotFoundException, InputDataValidationException, ProductVariantNotFoundException, StoreNotFoundException {
        Reservation reservationToUpdate = retrieveReservationByReservationId(reservationId);
        Store newStore = storeService.retrieveStoreById(newStoreId);
        Long oldStoreId = reservationToUpdate.getStore().getStoreId();

        // only can cancel if more than 15mins before
        Timestamp dateTime = reservationToUpdate.getReservationDateTime();
        long now = System.currentTimeMillis();
        long nowPlus15Minutes = now + TimeUnit.MINUTES.toMillis(15);
        Map<String, String> errorMap = new HashMap<>();

        // make sure at least 15 mins before reservation
        if (!dateTime.after(new Timestamp(nowPlus15Minutes))) {
            errorMap.put("reservationDateTime", "Reservation cannot be updated less than 15 minutes before.");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }

        //cannot edit past reservations
        if (reservationToUpdate.getReservationDateTime().before(new Timestamp(System.currentTimeMillis()))) {
            errorMap.put("reservationDateTime", "You cannot edit past reservations");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }

        //check between 1 and 48 hours in advance
        Timestamp newDateTime = checkReservationTiming(newReservationDateTime);

        List<ProductVariant> productVariants = reservationToUpdate.getProductVariants();
        if (newStoreId != oldStoreId) {
            // check if store has stock for productVariants
            for (ProductVariant pv : productVariants) {
                //throw error when stock <= 0
                checkStoreStockForProductVariant(newStoreId, pv.getProductVariantId());
            }
        }

        // Check that timeslot is not taken
        List<Timestamp> reservedTimeSlots = getReservedTimeslotsForStore(newStoreId);
        if (reservedTimeSlots.contains(newDateTime)) {
            errorMap.put("reservationDateTime", "This time slot is already taken at " + newStore.getStoreName());
            throw new InputDataValidationException(errorMap, errorMap.get("reservationDateTime"));
        }
        reservationToUpdate.setReservationDateTime(newDateTime);

        if (!newStoreId.equals(oldStoreId)) {
            // Update store
            reservationToUpdate.setStore(newStore);
            // after update store, add to prev store stock, deduct from new store's stock
            for (ProductVariant pv : productVariants) {
                ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(oldStoreId, pv.getProductVariantId());
                productStock.setQuantity(productStock.getQuantity() + 1);
            }
            for (ProductVariant pv : productVariants) {
                ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(newStore.getStoreId(), pv.getProductVariantId());
                productStock.setQuantity(productStock.getQuantity() - 1);
            }
        }
        return reservationToUpdate;
    }

    public Reservation cancelReservation(Long reservationId) throws ReservationNotFoundException, InputDataValidationException {
        Reservation reservationToCancel = retrieveReservationByReservationId(reservationId);
        long now = System.currentTimeMillis();
        long nowPlus15Minutes = now + TimeUnit.MINUTES.toMillis(15);
        Map<String, String> errorMap = new HashMap<>();
        Timestamp dateTime = reservationToCancel.getReservationDateTime();
        if (!dateTime.after(new Timestamp(nowPlus15Minutes))) {
            errorMap.put("reservationDateTime", "Reservation cannot be cancelled less than 15 minutes before.");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }

        // Increment stock for productVariants in the store
        List<ProductVariant> productVariants = reservationToCancel.getProductVariants();
        Store store = reservationToCancel.getStore();
        for (ProductVariant pv : productVariants) {
            ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(store.getStoreId(), pv.getProductVariantId());
            productStock.setQuantity(productStock.getQuantity() + 1);
        }

        //Clear relationships
        store.getReservations().remove(reservationToCancel);
        reservationToCancel.setStore(null);
        reservationToCancel.setProductVariants(null);
        reservationToCancel.getCustomer().getReservations().remove(reservationToCancel);
        reservationToCancel.setCustomer(null);

        reservationRepository.delete(reservationToCancel);

        return reservationToCancel;
    }

    //Get product variant stock, given the store
    public Map<Long, Map<String, Object>> getProdVariantStoreStockStatusForCart(Long customerId, Long storeId) throws StoreNotFoundException, ProductVariantNotFoundException, CustomerNotFoundException {
        Customer customer = customerService.retrieveCustomerByCustomerId(customerId);
        return getProdVariantStoreStockStatus(customer.getReservationCartItems(), storeId);
    }

    public Map<Long, Map<String, Object>> getProdVariantStoreStockStatusForReservation(Long reservationId, Long storeId) throws StoreNotFoundException, ProductVariantNotFoundException, CustomerNotFoundException, ReservationNotFoundException {
        Reservation reservation = retrieveReservationByReservationId(reservationId);
        return getProdVariantStoreStockStatus(reservation.getProductVariants(), storeId);
    }


    public Map<Long, Map<String, Object>> getProdVariantStoreStockStatus(List<ProductVariant> productVariants, Long storeId) {
        Map<Long, Map<String, Object>> result = new HashMap<>();
        for (ProductVariant pv : productVariants) {
            ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(storeId, pv.getProductVariantId());
            String storeName = productStock.getStore().getStoreName();
            Map<String, Object> stockAndName = new HashMap<>();
            stockAndName.put("quantity", productStock.getQuantity());
            stockAndName.put("storeName", storeName);
            if (productStock != null && productStock.getQuantity() != null) {
                result.put(pv.getProductVariantId(), stockAndName);
            }
        }
        return result;
    }

    public List<ReservationStockCheckResponse> getAllStoresStockStatusForCart(Long customerId) throws CustomerNotFoundException, ProductVariantNotFoundException, StoreNotFoundException {

        List<ProductVariant> reservationCartItems = customerService.retrieveCustomerByCustomerId(customerId).getReservationCartItems();
        return checkAllStoreStocksForGivenProductVariants(reservationCartItems);
    }

    public List<ReservationStockCheckResponse> getAllStoresStockStatusForReservation(Long reservationId) throws CustomerNotFoundException, ProductVariantNotFoundException, StoreNotFoundException, ReservationNotFoundException {

        List<ProductVariant> reservationItems = retrieveReservationByReservationId(reservationId).getProductVariants();
        return checkAllStoreStocksForGivenProductVariants(reservationItems);
    }

    // Checking if store can fulfill the stock for a list of product variants
    private List<ReservationStockCheckResponse> checkAllStoreStocksForGivenProductVariants(List<ProductVariant> productVariants) throws ProductVariantNotFoundException, StoreNotFoundException {
        List<ReservationStockCheckResponse> result = new ArrayList<>();
        List<Store> allStores = storeService.retrieveAllStores();
        for (Store store : allStores) {
            int numItemsNoStock = 0;
            for (ProductVariant reservationCartItem : productVariants) {
                try {
                    checkStoreStockForProductVariant(store.getStoreId(), reservationCartItem.getProductVariantId());
                } catch (InputDataValidationException ex) { //insufficient stock
                    numItemsNoStock++;
                }
            }
            if (numItemsNoStock == 0) {
                result.add(new ReservationStockCheckResponse(store, "In stock"));
            } else if (numItemsNoStock == productVariants.size()) {
                result.add(new ReservationStockCheckResponse(store, "Out of stock"));
            } else {
                result.add(new ReservationStockCheckResponse(store, "Partially in stock"));
            }
        }
        return result;
    }

    public Timestamp checkReservationTiming(String reservationDateTime) throws InputDataValidationException {
        //reservationDateTime is in format YYYY-MM-DD HH:mm:ss

        //By default will read as UTC time since no timezone specified
        String isoString = reservationDateTime.replace(" ", "T");
        LocalDateTime ldt = LocalDateTime.parse(isoString);
        //Convert to SG time zone i.e. adding +0800 to the string
        ZonedDateTime zonedDateTime= ZonedDateTime.of(ldt, ZoneId.of("Singapore"));
        //Get the UTC time for the zoned date time
        Timestamp dateTime = Timestamp.from(zonedDateTime.toInstant());
        long now = System.currentTimeMillis();
        long nowPlus1Hour = now + TimeUnit.HOURS.toMillis(1);
        long nowPlus48Hour = now + TimeUnit.HOURS.toMillis(48);
        Map<String, String> errorMap = new HashMap<>();
        // make sure at least 1h in advance and no more than 48 in advance
        if (!(dateTime.after(new Timestamp(nowPlus1Hour)) && dateTime.before(new Timestamp(nowPlus48Hour)))) {
            errorMap.put("reservationDateTime", "Reservation must be between 1 to 48 hours in advance");
            throw new InputDataValidationException(errorMap, errorMap.toString());
        }

        return dateTime;
    }

    public Reservation updateReservationStatus(Long reservationId, Boolean isHandled, Boolean isAttended) throws ReservationNotFoundException {
        Reservation reservation = retrieveReservationByReservationId(reservationId);
        if (isHandled != null) reservation.setHandled(isHandled);
        if (isAttended != null) reservation.setAttended(isAttended);
        return reservation;
    }

    private boolean isTimestampFromNowTo48h(Timestamp timestamp) {
        long now = System.currentTimeMillis();
        long nowPlus1Hour = now + TimeUnit.HOURS.toMillis(1);
        long nowPlus48Hour = now + TimeUnit.HOURS.toMillis(48);
        if (timestamp.after(new Timestamp(nowPlus1Hour)) && timestamp.before(new Timestamp(nowPlus48Hour))) {
            return true;
        }
        return false;
    }

    private void checkStoreStockForProductVariant(Long storeId, Long productVariantId) throws InputDataValidationException, ProductVariantNotFoundException, StoreNotFoundException {
        Map<String, String> errorMap = new HashMap<>();
        Store store = storeService.retrieveStoreById(storeId);
        ProductVariant pv = productService.retrieveProductVariantById(productVariantId);
        ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(storeId, pv.getProductVariantId());
        if (productStock != null) {
            if (productStock.getQuantity() <= 0) {
                // not enough quantity, throw error
                errorMap.put(productVariantId.toString(), "Out of stock at " + store.getStoreName());
                throw new InputDataValidationException(errorMap, errorMap.toString());
            }
        }
    }

    public List<Reservation> getUpcomingReservationsForStore(Long storeId){
        List<Reservation> reservations = reservationRepository.findAllByStore_StoreId(storeId);
        List<Reservation> result = new LinkedList<>();
        long now = System.currentTimeMillis();
        long nowMinus15Minutes = now - + TimeUnit.MINUTES.toMillis(15);
        for (Reservation r : reservations){
            if (r.getReservationDateTime().after(new Timestamp(nowMinus15Minutes))){
                result.add(r);
            }
        }
        return result;
    }

}
