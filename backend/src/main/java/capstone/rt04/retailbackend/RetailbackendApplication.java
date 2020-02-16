package capstone.rt04.retailbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RetailbackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(RetailbackendApplication.class, args);
    }

}
