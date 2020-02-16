package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Store;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;

import java.sql.Time;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class StoreServiceTest {

    @Autowired
    private StoreService storeService;

    private static Long storeId;

    @Before
    public void beforeEachTest() throws Exception{
        Store expectedValidStore = new Store(8, Time.valueOf("10:00:00"), Time.valueOf("21:00:00"), 2, 6, null);
        Store testValidStore = storeService.createNewStore(expectedValidStore);
        assertThat(testValidStore.getStoreId()).isNotNull();
        assertThat(testValidStore).isEqualTo(expectedValidStore);
        storeId = testValidStore.getStoreId();
    }

    @After
    public void afterEachTest() throws Exception {
        Store storeToRemove = storeService.retrieveStoreById(storeId);
        Store removedStore = storeService.deleteStore(storeToRemove.getStoreId());
        assertThat(removedStore.getStoreId()).isEqualTo(storeToRemove.getStoreId());
    }

    @Test
    public void createNewStore() throws Exception {
        //numChangingRooms, openingTime, closingTime, numManagers, numAssistants,address
        Store invalidStore = new Store(0, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 0, 0, null);
        try {
            storeService.createNewStore(invalidStore);
        } catch (InputDataValidationException ex) {
            Map<String, String> expectedErrorMap = new HashMap<>();
            expectedErrorMap.put("numChangingRooms", "must be greater than 0");
            expectedErrorMap.put("numManagers", "must be greater than 0");
            expectedErrorMap.put("numAssistants", "must be greater than 0");
            assertThat(ex.getErrorMap()).isEqualTo(expectedErrorMap);
        }
    }

    @Test
    public void retrieveStoreById() throws Exception {
        Store store = storeService.retrieveStoreById(storeId);
        //changed from store.toString() as has lazy initalization exception
        System.out.println(store.getOpeningTime().toString());
    }

    @Test
    public void retrieveAllStores() throws Exception {
        List<Store> allStores = storeService.retrieveAllStores();
        assertThat(allStores).isNotNull();
    }

    @Test
    public void updateStore() throws Exception {
        Store store = new Store(6, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 2, 8, null);
        Store newStore = storeService.createNewStore(store);
        System.out.println(newStore.getStoreId());
        newStore.setNumAssistants(6);
        Store updatedStore = storeService.updateStore(newStore);
        assertThat(newStore.getStoreId()).isEqualTo(updatedStore.getStoreId());
    }

    @Test
    public void deleteStore() throws Exception {
        Store newStore = new Store(8, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 1, 8, null);
        storeService.createNewStore(newStore);

        int storeNumberBeforeDeletion = storeService.retrieveAllStores().size();
        storeService.deleteStore(newStore.getStoreId());
        int storeNumberAfterDeletion = storeService.retrieveAllStores().size();
        assertThat(storeNumberBeforeDeletion).isNotEqualTo(storeNumberAfterDeletion);
    }

}


