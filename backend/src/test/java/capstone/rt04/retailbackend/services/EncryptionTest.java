package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.SizeDetails;
import capstone.rt04.retailbackend.repositories.SizeDetailsRepository;
import capstone.rt04.retailbackend.util.AES;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class EncryptionTest {

    @Autowired
    private SizeDetailsRepository sizeDetailsRepository;
    @Autowired
    private SizeDetailsService sizeDetailsService;

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

    @Test
    public void retrieveEnumValue() {
        SizeDetails sizeDetails = new SizeDetails(SizeEnum.XS);
        sizeDetailsRepository.save(sizeDetails);

        SizeDetails size = sizeDetailsService.retrieveSizeDetailsByEnum("XS");
        System.out.println(size.toString());
    }
}
