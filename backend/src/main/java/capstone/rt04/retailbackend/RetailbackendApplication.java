package capstone.rt04.retailbackend;

import capstone.rt04.retailbackend.request.algolia.AlgoliaProductDetailsResponse;
import com.algolia.search.DefaultSearchClient;
import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class RetailbackendApplication {

    @Value("${algolia.key}")
    private String algoliaKey;

    @Bean
    SearchIndex<AlgoliaProductDetailsResponse> initSearchIndex(){
        SearchClient client =
                DefaultSearchClient.create("0B4ODLCUAM", algoliaKey);

        SearchIndex<AlgoliaProductDetailsResponse> index = client.initIndex("Apricot", AlgoliaProductDetailsResponse.class);
        return index;
    }

    public static void main(String[] args) {

        java.security.Security.setProperty("networkaddress.cache.ttl", "60");
        SpringApplication.run(RetailbackendApplication.class, args);
    }

}
