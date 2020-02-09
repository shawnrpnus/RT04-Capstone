package capstone.rt04.retailbackend.services;

import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StaffService {
    private JavaMailSender javaMailSender;

    private final Environment environment;

    private final ValidationService validationService;

    public StaffService(JavaMailSender javaMailSender, Environment environment, ValidationService validationService) {
        this.javaMailSender = javaMailSender;
        this.environment = environment;
        this.validationService = validationService;
    }
}
