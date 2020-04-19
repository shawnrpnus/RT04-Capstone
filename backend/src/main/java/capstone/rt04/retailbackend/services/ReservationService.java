package capstone.rt04.retailbackend.services;


import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.repositories.ReservationRepository;
import capstone.rt04.retailbackend.repositories.StaffRepository;
import capstone.rt04.retailbackend.request.expo.ExpoPushNotificationRequest;
import capstone.rt04.retailbackend.response.ReservationStockCheckResponse;
import capstone.rt04.retailbackend.response.analytics.ReservationsByTimeSlot;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.ProductVariantNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.reservation.ReservationNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cglib.core.CollectionUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ReservationService {

    private final String BEFORE = "before";
    private final String AFTER = "after";

    private final CustomerService customerService;
    private final ProductService productService;
    private final StoreService storeService;
    private final ValidationService validationService;
    private RestTemplate restTemplate;

    private final ReservationRepository reservationRepository;
    private final StaffRepository staffRepository;

    public ReservationService(CustomerService customerService, ProductService productService, StoreService storeService, ValidationService validationService, ReservationRepository reservationRepository, RestTemplateBuilder restTemplateBuilder, StaffRepository staffRepository) {
        this.customerService = customerService;
        this.productService = productService;
        this.storeService = storeService;
        this.validationService = validationService;
        this.reservationRepository = reservationRepository;
        this.restTemplate = restTemplateBuilder.build();
        this.staffRepository = staffRepository;
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

        // check reservationDateTime not fully taken at store
        List<Timestamp> reservedTimeSlots = getReservedTimeslotsForStore(storeId);
        if (countNumReservationsForTimeslot(reservedTimeSlots, reservationDateTime) >= store.getNumReservedChangingRooms()) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("reservationDateTime", "This time slot is already taken at " + store.getStoreName());
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

    public List<Reservation> retrieveAllReservations() {
        return reservationRepository.findAll();
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

    public <T> Integer countNumReservationsForTimeslot(List<T> reservedSlots, T timeslot) {
        int count = 0;
        for (T dateTime : reservedSlots) {
            if (dateTime.equals(timeslot)) count++;
        }
        return count;
    }

    public List<ZonedDateTime> getAvailTimeSlotsForStore(Long storeId) throws StoreNotFoundException {
        return getAvailTimeSlotsByStoreAndZonedDateTime(storeId, ZonedDateTime.now(ZoneId.of("Singapore")));
    }

    private List<ZonedDateTime> getAvailTimeSlotsByStoreAndZonedDateTime(Long storeId, ZonedDateTime dateTime) throws StoreNotFoundException {
        Store store = storeService.retrieveStoreById(storeId);
        Integer reservationPerTimeslotLimit = store.getNumReservedChangingRooms();
        List<ZonedDateTime> result = new ArrayList<>();
        List<Timestamp> reservedSlots = getReservedTimeslotsForStore(storeId);

        LocalTime openingTime = store.getOpeningTime().toLocalTime();
        LocalTime closingTime = store.getClosingTime().toLocalTime();

        ZonedDateTime now = dateTime;
        //Get allowed time window for reservations
        ZonedDateTime nowPlus1Hour = now.plusHours(1);
        nowPlus1Hour = nowPlus1Hour.truncatedTo(ChronoUnit.HOURS).plusMinutes((15 * ((nowPlus1Hour.getMinute()) / 15)) + 15);
        ZonedDateTime nowPlus48Hour = now.plusHours(48);
        nowPlus48Hour = nowPlus48Hour.truncatedTo(ChronoUnit.HOURS).plusMinutes((15 * ((nowPlus1Hour.getMinute()) / 15)));

        //Convert timestamps to zonedDateTime
        List<ZonedDateTime> reservedZoneDateTimes = new ArrayList<>();
        for (Timestamp reservedTimestamp : reservedSlots) {
            reservedZoneDateTimes.add(ZonedDateTime.ofInstant(reservedTimestamp.toInstant(), now.getZone()));
        }

        //loop from nowPLus1Hour to nowPlus48hour
        /*in each iteration, check that the time is between opening and closing time and
           that curr num of reservations in that time slot is < limit
         */
        while (nowPlus1Hour.isBefore(nowPlus48Hour)) {
            LocalTime localTimeToCheck = LocalTime.of(nowPlus1Hour.getHour(), nowPlus1Hour.getMinute());
            if (localTimeToCheck.isAfter(openingTime)
                    && localTimeToCheck.isBefore(closingTime)
                    && countNumReservationsForTimeslot(reservedZoneDateTimes, nowPlus1Hour) < reservationPerTimeslotLimit) {
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
        if (countNumReservationsForTimeslot(reservedTimeSlots, newDateTime) >= newStore.getNumReservedChangingRooms()) {
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

    public List<ReservationStockCheckResponse> getAllStoresStockStatusForReservation(Long reservationId) throws ProductVariantNotFoundException, StoreNotFoundException, ReservationNotFoundException {

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
        ZonedDateTime zonedDateTime = ZonedDateTime.of(ldt, ZoneId.of("Singapore"));
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

    public List<Reservation> getUpcomingReservationsForStore(Long storeId) {
        List<Reservation> reservations = reservationRepository.findAllByStore_StoreId(storeId);
        List<Reservation> result = new LinkedList<>();
        long now = System.currentTimeMillis();
        long nowMinus15Minutes = now - +TimeUnit.MINUTES.toMillis(15);
        for (Reservation r : reservations) {
            if (r.getReservationDateTime().after(new Timestamp(nowMinus15Minutes))) {
                result.add(r);
            }
        }
        return result;
    }

    public Reservation updateReservationStatus(Long reservationId, Boolean isHandled, Boolean isAttended) throws ReservationNotFoundException {
        Reservation reservation = retrieveReservationByReservationId(reservationId);
        if (isHandled != null) {
            reservation.setHandled(isHandled);
            for (ProductVariant pv : reservation.getProductVariants()) {
                ProductStock productStock = productService.retrieveProductStockByStoreIdAndProductVariantId(reservation.getStore().getStoreId(), pv.getProductVariantId());
                productStock.setQuantity(productStock.getQuantity() + 1);
            }
        }
        if (isAttended != null) {
            reservation.setAttended(isAttended);
        }
        return reservation;
    }

    public List<Reservation> getCloseReservationsForStore(Long storeId) {
        List<Reservation> allReservations = reservationRepository.findAllByStore_StoreId(storeId);
        List<Reservation> result = new ArrayList<>();
        long now = System.currentTimeMillis();
        Timestamp nowPlus14Minutes = new Timestamp(now + TimeUnit.MINUTES.toMillis(14));
        Timestamp nowPlus15Minutes = new Timestamp(now + TimeUnit.MINUTES.toMillis(15));
        for (Reservation r : allReservations) {
            if (r.getReservationDateTime().after(nowPlus14Minutes) && r.getReservationDateTime().before(nowPlus15Minutes)) {
                //reservation is in between 14 and 15 minutes time
                result.add(r);
            }
        }
        return result;
    }

    //send to all employees in the store
    public void sendExpoPushNotifToStore(Long storeId) {
        List<Staff> staffToSendNotif = staffRepository.findAllByStore_StoreId(storeId);
        List<String> tokens = new ArrayList<>();
        for (Staff s : staffToSendNotif) {
            if (s.getPushNotificationToken() != null) {
                tokens.add(s.getPushNotificationToken());
            }
        }
        if (tokens.size() > 0) {
            Map<String, String> data = new HashMap<>();
            data.put("type", "reservationReminder");
            sendExpoPushNotifWithTokens(tokens,
                    "Upcoming Reservations",
                    "There are reservation(s) that require your attention!",
                    data, "reservation");
        }
    }

    public void sendPushNotifToAllStores(){
        List<Store> stores = storeService.retrieveAllStores();
        for (Store s : stores){
            sendExpoPushNotifToStore(s.getStoreId());
        }
    }

    public void sendPushNotificationToCustomer(Long customerId) throws CustomerNotFoundException {
        Customer c = customerService.retrieveCustomerByCustomerId(customerId);
        List<String> tokens = new ArrayList<>();
        tokens.add(c.getPushNotificationToken());
        Map<String, String> data = new HashMap<>();
        data.put("type", "reservationReminder");
        sendExpoPushNotifWithTokens(tokens,
                "Upcoming Reservation",
                "You have a reservation in 1 hour!",
                data, "reservation");

    }

    public void sendExpoPushNotifWithTokens(List<String> tokens, String title,
                                            String body, Object data, String channelId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("host", "exp.host");
        headers.set("accept", "application/json");
        headers.set("accept-encoding", "gzip, deflate");
        headers.set("content-type", "application/json");

        ExpoPushNotificationRequest req = new ExpoPushNotificationRequest();
        req.setTo(tokens);
        req.setTitle(title);
        req.setBody(body);
        req.setData(data);
        req.setPriority("high");
        req.setSound("default");
        req.setChannelId(channelId);
        HttpEntity<ExpoPushNotificationRequest> httpEntity = new HttpEntity<>(req, headers);

        String url = "https://exp.host/--/api/v2/push/send";

        try {
            ResponseEntity<?> response = restTemplate.postForEntity(url, httpEntity, Object.class);
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
    }

    public void generateTestReservations(Integer numReservations) throws ProductVariantNotFoundException, StoreNotFoundException, CustomerNotFoundException {
        Random r = new Random();
        // 4 types of transactions
        List<Customer> allCustomers = customerService.retrieveAllCustomers();
        List<ProductVariant> productVariants = productService.retrieveAllProductVariant();

        for (int i = 0; i < numReservations; i++) {
            Customer customer = allCustomers.get(r.nextInt(allCustomers.size()));
            ProductVariant pv = productVariants.get(r.nextInt(productVariants.size()));
            customer.getReservationCartItems().add(pv);
            List<ReservationStockCheckResponse> storesStockStatus = getAllStoresStockStatusForCart(customer.getCustomerId());
            List<Store> availStores = new ArrayList<>();
            for (ReservationStockCheckResponse resStockCheckResp : storesStockStatus) {
                if (resStockCheckResp.getStockStatus() == "In stock") {
                    availStores.add(resStockCheckResp.getStore());
                }
            }
            if (availStores.size() == 0) break;

            Store storeForReservation = availStores.get(r.nextInt(availStores.size()));
            ZonedDateTime randomZonedDateTime = ZonedDateTime.now(ZoneId.of("Singapore")).minusDays(1).minusHours(r.nextInt(2160) + 1);
            List<ZonedDateTime> availTimeslots = getAvailTimeSlotsByStoreAndZonedDateTime(storeForReservation.getStoreId(), randomZonedDateTime);
            if (availTimeslots.size() == 0) break;

            ZonedDateTime chosenTimeslot = availTimeslots.get(r.nextInt(availTimeslots.size()));
            Reservation reservation = new Reservation(Timestamp.from(chosenTimeslot.toInstant()), customer.getReservationCartItems(), customer, storeForReservation);
            storeForReservation.getReservations().add(reservation);
            customer.getReservations().add(reservation);
            reservationRepository.save(reservation);
            customer.setReservationCartItems(new ArrayList<>());
            log.info("Reservation " + i + " created");
        }
    }

    public Map<String, Object> getReservationsPerTimeSlotData(String fromDateString, String toDateString, List<Long> storeIds){
        //for each local time, retrieve reservations and do calculation
        List<LocalTime> localTimes = generateTimeSlotsFromStores();
        List<Store> stores = storeService.retrieveAllStores();
        Map<String, Object> resultWithReservationDateRange = new HashMap<>();
        List<Reservation> allReservations = reservationRepository.findAllByOrderByReservationDateTime();
        resultWithReservationDateRange.put("earliestReservationDate", allReservations.get(0).getReservationLocalDate());
        resultWithReservationDateRange.put("latestReservationDate", allReservations.get(allReservations.size()-1).getReservationLocalDate());
        List<ReservationsByTimeSlot> result = new ArrayList<>();
        for (LocalTime localTime : localTimes){
            List<Reservation> reservations = getReservationsFromStoresForLocalTimeWithinDate(localTime, fromDateString, toDateString, storeIds);
            Integer totalReservations = reservations.size();
            ReservationsByTimeSlot reservationsByTimeSlot = new ReservationsByTimeSlot(localTime, totalReservations);
            BigDecimal sumOfStoreAverages = BigDecimal.ZERO;
            //getting individual store info
            for (Store store: stores){
                List<Reservation> storeReservations = reservations.stream()
                        .filter(r -> r.getStore().getStoreId().equals(store.getStoreId()))
                        .collect(Collectors.toList());
                Integer totalStoreReservations = storeReservations.size();
                BigDecimal averageStoreReservations = calculateAverageReservationForReservationsInTimeslot(storeReservations);
                reservationsByTimeSlot.setTotalReservationsForStore(store.getStoreId(), totalStoreReservations);
                reservationsByTimeSlot.setAverageReservationsForStore(store.getStoreId(), averageStoreReservations);
                sumOfStoreAverages = sumOfStoreAverages.add(averageStoreReservations);
            }
            reservationsByTimeSlot.setAverageReservations(sumOfStoreAverages);
            result.add(reservationsByTimeSlot);
        }
        resultWithReservationDateRange.put("result", result);
        return resultWithReservationDateRange;
    }

    //generate list of 15 min intervals from earliest store opening time and latest store closing
    private List<LocalTime> generateTimeSlotsFromStores(){
        List<Store> stores = storeService.retrieveAllStores();
        LocalTime earliestOpening = stores.get(0).getOpeningTime().toLocalTime();
        LocalTime latestClosing = stores.get(0).getClosingTime().toLocalTime();

        for (Store s : stores){
            if (s.getOpeningTime().toLocalTime().isBefore(earliestOpening)){
                earliestOpening = s.getOpeningTime().toLocalTime();
            }
            if (s.getClosingTime().toLocalTime().isAfter(latestClosing)){
                latestClosing = s.getClosingTime().toLocalTime();
            }
        }

        List<LocalTime> result = new ArrayList<>();
        while (earliestOpening.isBefore(latestClosing)){
            result.add(earliestOpening);
            earliestOpening = earliestOpening.plusMinutes(15);
        }
        result.add(latestClosing);

        return result;
    }

    //Strings must be YYYY-MM-DD
    public List<Reservation> getReservationsFromStoresForLocalTimeWithinDate(LocalTime localTime, String fromDateString, String toDateString, List<Long> storeIds){
        List<Reservation> reservations = retrieveAllReservations();
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Singapore"));
        List<Reservation> result = new ArrayList<>();
        for (Reservation reservation : reservations){
            ZonedDateTime reservationDateTime = ZonedDateTime.ofInstant(
                    reservation.getReservationDateTime().toInstant(), now.getZone());
            if (reservation.isBetween(fromDateString, toDateString)
                    && (storeIds == null || storeIds.contains(reservation.getStore().getStoreId()))) {
                LocalTime reservationLocalTime = LocalTime.of(reservationDateTime.getHour(),
                        reservationDateTime.getMinute());
                if (localTime.equals(reservationLocalTime)) {
                    result.add(reservation);
                }
            }
        }
        return result;
    }

    public BigDecimal calculateAverageReservationForReservationsInTimeslot(List<Reservation> reservations){
        if (reservations.size() == 0) return BigDecimal.ZERO;

        //Reservations passed in have the same time slot
        //Count unique dates (YYYY-MM-DD) within the list, then divide total by dates
        List<LocalDate> uniqueLocalDates = new ArrayList<>();
        for (Reservation r : reservations){
            if (!uniqueLocalDates.contains(r.getReservationLocalDate())){
                uniqueLocalDates.add(r.getReservationLocalDate());
            }
        }

        BigDecimal numReservations = BigDecimal.valueOf(reservations.size());
        BigDecimal numDates = BigDecimal.valueOf(uniqueLocalDates.size());
        return numReservations.divide(numDates, 2, RoundingMode.HALF_EVEN);
    }

//    public List<LocalTime> getUniqueLocalTimesFromReservations(){
//        List<Reservation> reservations = retrieveAllReservations();
//        List<LocalTime> uniqueLocalTimes = new ArrayList<>();
//        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Singapore"));
//        for (Reservation r : reservations){
//            ZonedDateTime zdt = ZonedDateTime.ofInstant(r.getReservationDateTime().toInstant(), now.getZone());
//            LocalTime lt = LocalTime.of(zdt.getHour(), zdt.getMinute());
//            if (!uniqueLocalTimes.contains(lt)) {
//                uniqueLocalTimes.add(lt);
//            }
//        }
//        Collections.sort(uniqueLocalTimes);
//        return uniqueLocalTimes;
//    }
}
