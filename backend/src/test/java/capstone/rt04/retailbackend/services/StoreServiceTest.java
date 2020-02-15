package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Store;
import org.junit.Before;
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

    @Test
    public void createNewStore() throws Exception {
        //numChangingRooms, openingTime, closingTime, numManagers, numAssistants,address
        Store newStore = new Store(8, Time.valueOf("11:00:00"), Time.valueOf("21:00:00"), 1, 8, null);
        storeService.createNewStore(newStore);
    }

    @Test
    public void retrieveAllStores() throws Exception {
        List<Store> allStores = storeService.retrieveAllStores();
        assertThat(allStores).isNotNull();
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

    @Test
    public void retrieveStoreById() throws Exception {
        Store store = storeService.retrieveStoreById(storeId);
    }
}


