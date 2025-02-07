package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.*;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
@Transactional
@Slf4j
public class TimerService {

    private final CustomerService customerService;
    private final JavaMailSender javaMailSender;
    private final ProductService productService;
    private final WarehouseService warehouseService;
    private final ReservationService reservationService;
    private final StoreService storeService;
    private RestTemplate restTemplate;

    @Value("${node.backend.url}")
    private String NODE_API_URL;

    @Value("${customer.web.url}")
    private String CUSTOMER_WEB_URL;

    private final Integer unattendedTimeLimit = 4;

    // development
    private static final int intervalMinute = 60 * 1000 * 1000;
    // production
    // private static final int intervalMinute = 60 * 1000 ;
    private static final int intervalDay = 60 * 60 * 1000 * 24;
    private static final int interval10Minutes = 10 * intervalMinute;

    public TimerService(CustomerService customerService, JavaMailSender javaMailSender,
                        ProductService productService, WarehouseService warehouseService, ReservationService reservationService, StoreService storeService, RestTemplateBuilder builder) {
        this.customerService = customerService;
        this.javaMailSender = javaMailSender;
        this.productService = productService;
        this.warehouseService = warehouseService;
        this.reservationService = reservationService;
        this.storeService = storeService;
        this.restTemplate = builder.build();
    }

    //    @Scheduled(fixedRate = intervalDay, initialDelay = 20000)
    public void checkForLowStockProducts() throws ProductStockNotFoundException {
        //update size here for the set of automatically reordering from SUPPLIER -> WAREHOUSE
        List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();
        for (Warehouse w : warehouses) {
            List<ProductStock> productStocks = productService.retrieveProductStockQuantityLessThanRequired(w.getWarehouseId());

            for (ProductStock p : productStocks) {
                //instantaneous reordering
                p.setQuantity(p.getReorderQuantity() + p.getQuantity());
//                log.info("is quantity updated: " + p.getQuantity());
                productService.updateProductStock(p);
            }
        }
//        log.info("donee");
    }

    //    @Scheduled(fixedRate = intervalDay, initialDelay = 10000)
    public void monthlyReorderingForWarehouse() throws ProductStockNotFoundException {

        List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();

        for (Warehouse w : warehouses) {
//            log.info("asdf"+w.getDayOfMonth());
            LocalDate localDate = LocalDate.now();
//            log.info("asdfasdf"+localDate.getDayOfMonth());
            if (w.getDayOfMonth() != localDate.getDayOfMonth()) {
//                log.info("DID THIS HAPPPEN");
                continue;
            }
            List<ProductStock> productStocks = productService.retrieveProductStockQuantityLessThanRequired(w.getWarehouseId());
            for (ProductStock p : productStocks) {
                //instantaneous reordering
                p.setQuantity(p.getReorderQuantity() + p.getQuantity());
                log.info("is quantity updated: " + p.getQuantity());
                productService.updateProductStock(p);
            }
        }
        log.info("doneeee monthly reordering");
    }

    // in milliseconds
    @Scheduled(fixedRate = intervalMinute, initialDelay = 10000)
    public void checkForUnattendedShoppingCarts() {
        log.info("checkForUnattendedShoppingCarts() triggered");
        List<Customer> allCustomers = customerService.retrieveAllCustomers();

        for (Customer customer : allCustomers) {
            ShoppingCart onlineShoppingCart = customer.getOnlineShoppingCart();

            // only applied to non-empty shopping carts
            if (!onlineShoppingCart.getShoppingCartItems().isEmpty()) {
                Timestamp lastUpdatedTime = onlineShoppingCart.getLastUpdated();
//                Timestamp threshold = new Timestamp(lastUpdatedTime.getTime() + TimeUnit.HOURS.toMillis(unattendedTimeLimit));
                Timestamp threshold = new Timestamp(lastUpdatedTime.getTime() + TimeUnit.MINUTES.toMillis(1));
                if (threshold.before(new Timestamp(System.currentTimeMillis()))) {
                    //e.g. if last updated time + 4h is before now, means haven't updated in at least 4h
                    String email = customer.getEmail();
                    Map<String, String> request = new HashMap<>();
                    String fullName = customer.getFirstName();
                    String link = CUSTOMER_WEB_URL + "/account/shoppingCart";
                    request.put("link", link);
                    request.put("email", email);
                    request.put("fullName", fullName);
                    String endpoint = NODE_API_URL + "/email/sendUnattendedCartEmail";
                    ResponseEntity<?> response = restTemplate.postForEntity(endpoint, request, Object.class);
                    if (response.getStatusCode().equals(HttpStatus.OK)) {
                        log.info("Email sent successfully to " + email);
                    } else {
                        log.error("Error sending email to " + email);
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 60 * 1000, initialDelay = 5000)
    public void checkCloseReservations(){
        List<Store> stores = storeService.retrieveAllStores();
        for (Store store : stores) {
            List<Reservation> closeReservations = reservationService.getCloseReservationsForStore(store.getStoreId());
            if (closeReservations.size() > 0){
                reservationService.sendExpoPushNotifToStore(store.getStoreId());
                log.info("Push notification sent");
            }
        }
    }

    @Scheduled(fixedRate = 60 * 1000, initialDelay = 5000)
    public void checkCloseReservationsForCustomers(){
        List<Reservation> reservations = reservationService.retrieveAllReservations();
        long now = System.currentTimeMillis();
        Timestamp bottomLimit = new Timestamp(now + TimeUnit.MINUTES.toMillis(59));
        Timestamp  topLimit = new Timestamp(now + TimeUnit.MINUTES.toMillis(60));
        List<String> tokens = new ArrayList<>();
        for (Reservation r : reservations){
            if (r.getReservationDateTime().after(bottomLimit) && r.getReservationDateTime().before(topLimit)) {
                tokens.add(r.getCustomer().getPushNotificationToken());
            }
        }
        if (tokens.size() > 0) {
            Map<String, String> data = new HashMap<>();
            data.put("type", "reservationReminder");
            reservationService.sendExpoPushNotifWithTokens(tokens,
                    "Upcoming Reservation",
                    "You have a reservation in 1 hour!",
                    data, "reservation");
            log.info("Push notifications sending triggered for customers");
        }
    }

}
