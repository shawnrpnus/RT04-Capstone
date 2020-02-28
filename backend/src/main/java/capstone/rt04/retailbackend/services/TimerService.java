package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Customer;
import capstone.rt04.retailbackend.entities.ProductStock;
import capstone.rt04.retailbackend.entities.ShoppingCart;
import capstone.rt04.retailbackend.entities.Warehouse;
import capstone.rt04.retailbackend.util.exceptions.product.ProductStockNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class TimerService {

    private final CustomerService customerService;
    private final JavaMailSender javaMailSender;
    private final ProductService productService;
    private final WarehouseService warehouseService;

    private final Integer unattendedTimeLimit = 4;

    private static final int intervalMs = 60 * 60 * 1000;
    private static final int intervalDay = 60 * 60 * 1000 * 24;

    public TimerService(CustomerService customerService, JavaMailSender javaMailSender,
                        ProductService productService, WarehouseService warehouseService) {
        this.customerService = customerService;
        this.javaMailSender = javaMailSender;
        this.productService = productService;
        this.warehouseService = warehouseService;
    }

    @Scheduled(fixedRate = intervalDay, initialDelay = 20000)
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

    @Scheduled(fixedRate = intervalDay, initialDelay = 10000)
    public void monthlyReorderingForWarehouse() throws ProductStockNotFoundException {

        List<Warehouse> warehouses = warehouseService.retrieveAllWarehouses();

        for (Warehouse w : warehouses) {
//            log.info("asdf"+w.getDayOfMonth());
            LocalDate localDate = LocalDate.now();
//            log.info("asdfasdf"+localDate.getDayOfMonth());
            if(w.getDayOfMonth() != localDate.getDayOfMonth()) {
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
    @Scheduled(fixedRate = intervalMs, initialDelay = 10000)
    public void checkForUnattendedShoppingCarts() {
        log.info("checkForUnattendedShoppingCarts() triggered");
        List<Customer> allCustomers = customerService.retrieveAllCustomers();

        for (Customer customer : allCustomers) {
            ShoppingCart onlineShoppingCart = customer.getOnlineShoppingCart();

            // only applied to non-empty shopping carts
            if (!onlineShoppingCart.getShoppingCartItems().isEmpty()) {
                Timestamp lastUpdatedTime = onlineShoppingCart.getLastUpdated();
                Timestamp threshold = new Timestamp(lastUpdatedTime.getTime() + TimeUnit.HOURS.toMillis(unattendedTimeLimit));
                if (threshold.before(new Timestamp(System.currentTimeMillis()))) {
                    //e.g. if last updated time + 4h is before now, means haven't updated in at least 4h
                    String email = customer.getEmail();
                    SimpleMailMessage msg = new SimpleMailMessage();
                    msg.setTo(email);
                    msg.setSubject("Your shopping cart is waiting!");
                    msg.setText("Hello! We noticed you have yet to checkout your shopping cart items! " +
                            "Click here to continue shopping!");
                    javaMailSender.send(msg);
                    log.info("Email has been sent to {}", email);
                }
            }
        }
    }
}
