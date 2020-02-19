package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Store;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Time;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class StoreServiceTest extends ServiceTestSetup {

    @Autowired
    private StoreService storeService;

    /**
     * DO NOT DELETE STORE BEFORE DELETING PRODUCT
     * */

//    @Test
//    public void createNewStore() throws Exception {
//        //numChangingRooms, openingTime, closingTime, numManagers, numAssistants,address
//        Store invalidStore = new Store(0, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 0, 0, null);
//        try {
//            storeService.createNewStore(invalidStore);
//        } catch (InputDataValidationException ex) {
//            System.out.println("Catching");
//            Map<String, String> expectedErrorMap = new HashMap<>();
//            expectedErrorMap.put("numChangingRooms", "must be greater than 0");
//            expectedErrorMap.put("numManagers", "must be greater than 0");
//            expectedErrorMap.put("numAssistants", "must be greater than 0");
//            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
//        }
//    }

    @Test
    public void retrieveStoreById() throws Exception {
        Store store = storeService.retrieveStoreById(storeId);
        //changed from store.toString() as has lazy initialization exception
//        System.err.println(store.getOpeningTime().toString());
        assertThat(store.getStoreId()).isEqualTo(storeId);
    }
    @Test
    public void retrieveAllStores() throws Exception {
        List<Store> allStores = storeService.retrieveAllStores();
        assertThat(allStores).isNotNull();
    }

    @Test
    public void updateStore() throws Exception {
        Store store = storeService.retrieveStoreById(storeId);
        store.setNumAssistants(10);
        Store updatedStore = storeService.updateStore(store);
        assertThat(updatedStore.getNumAssistants()).isEqualTo(10);
    }

    @Test
    public void deleteStore() throws Exception {
        Store newStore = new Store("Store 1", 8, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 1, 8, null);
        newStore = storeService.createNewStore(newStore);

        /**
         * Throwing error before the store is deleted before the product and try to set
         * productStock.getStore().getProductStocks().remove(productStock) when deleting product
         * because productStock.getStore() returns null
         */
        int storeNumberBeforeDeletion = storeService.retrieveAllStores().size();
        storeService.deleteStore(newStore.getStoreId());
        int storeNumberAfterDeletion = storeService.retrieveAllStores().size();
        assertThat(storeNumberBeforeDeletion).isNotEqualTo(storeNumberAfterDeletion);
    }
}


