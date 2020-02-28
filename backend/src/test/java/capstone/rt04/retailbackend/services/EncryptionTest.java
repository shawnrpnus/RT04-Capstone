package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.util.AES;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class EncryptionTest {

    @Test
    public void encryptAndDecrypt() {

        final String secretKey = "thisisasecretkey";

        String originalString = "apricotn'nut.com";
        String encryptedString = AES.encrypt(originalString, secretKey) ;
        String decryptedString = AES.decrypt(encryptedString, secretKey) ;

        System.out.println(originalString);
        System.out.println(encryptedString);
        System.out.println(decryptedString);
    }
}
