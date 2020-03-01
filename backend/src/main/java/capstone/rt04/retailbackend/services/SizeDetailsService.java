package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.SizeDetails;
import capstone.rt04.retailbackend.repositories.SizeDetailsRepository;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class SizeDetailsService {

    private final ValidationService validationService;
    private final SizeDetailsRepository sizeDetailsRepository;


    public SizeDetailsService(ValidationService validationService, SizeDetailsRepository sizeDetailsRepository) {
        this.validationService = validationService;
        this.sizeDetailsRepository = sizeDetailsRepository;
    }

    public SizeDetails retrieveSizeDetailsByEnum(String size) {
        SizeDetails sizeDetails = sizeDetailsRepository.findByProductSize(SizeEnum.valueOf(size));
        return sizeDetails;
    }

    public List<SizeDetails> retrieveAllSizeDetails() {
        return (List<SizeDetails>) sizeDetailsRepository.findAll();
    }
}
