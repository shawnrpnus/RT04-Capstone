package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.SizeDetails;
import capstone.rt04.retailbackend.repositories.SizeDetailsRepository;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SizeDetailsService {

    private final ValidationService validationService;
    private final SizeDetailsRepository sizeDetailsRepository;


    public SizeDetailsService(ValidationService validationService, SizeDetailsRepository sizeDetailsRepository) {
        this.validationService = validationService;
        this.sizeDetailsRepository = sizeDetailsRepository;
    }

    public SizeDetails createSizeDetails(SizeDetails sizeDetails) throws InputDataValidationException {
        validationService.throwExceptionIfInvalidBean(sizeDetails);
        sizeDetailsRepository.save(sizeDetails);
        System.out.println("Size ID: " + sizeDetails.getSizeDetailsId());
        return sizeDetails;
    }
}
