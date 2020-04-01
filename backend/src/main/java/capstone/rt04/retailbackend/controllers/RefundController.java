package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Refund;
import capstone.rt04.retailbackend.entities.RefundLineItem;
import capstone.rt04.retailbackend.entities.RefundLineItemHandler;
import capstone.rt04.retailbackend.request.refund.RefundRequest;
import capstone.rt04.retailbackend.request.refund.UpdateRefundLineItemHandlerRequest;
import capstone.rt04.retailbackend.services.RefundService;
import capstone.rt04.retailbackend.services.ValidationService;
import capstone.rt04.retailbackend.util.enums.RefundModeEnum;
import capstone.rt04.retailbackend.util.enums.RefundProgressEnum;
import capstone.rt04.retailbackend.util.enums.RefundStatusEnum;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.customer.CustomerNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.promoCode.PromoCodeNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.refund.RefundNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.transaction.TransactionNotFoundException;
import capstone.rt04.retailbackend.util.routeconstants.RefundControllerRoutes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.RefundControllerRoutes.*;

@RestController
@RequestMapping(RefundControllerRoutes.REFUND_BASE_ROUTE)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RefundController {
    private final RefundService refundService;
    private final ValidationService validationService;

    public RefundController(RefundService refundService, ValidationService validationService) {
        this.refundService = refundService;
        this.validationService = validationService;
    }

    @PostMapping(CREATE_IN_STORE_REFUND_RECORD)
    public ResponseEntity<?> createInStoreRefundRecord(@RequestBody RefundRequest refundRequest) throws CustomerNotFoundException, TransactionNotFoundException, InputDataValidationException, PromoCodeNotFoundException, RefundNotFoundException {
        Refund refund = refundService.createInStoreRefund(refundRequest);
        //need to clear customer so that the response is faster
        clearRefundRelationships(refund);
        return new ResponseEntity<>(refund, HttpStatus.CREATED);
    }

    @PostMapping(UPDATE_REFUND_RECORD)
    public ResponseEntity<?> updateRefundRecord(@RequestBody List<UpdateRefundLineItemHandlerRequest> updateRefundLineItemHandlerRequests) throws RefundNotFoundException {
        Refund refund = refundService.updateRefundLineItemsStatus(updateRefundLineItemHandlerRequests);
        return new ResponseEntity<>(refund, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_REFUND_STATUS_ENUM)
    public ResponseEntity<?> retrieveAllRefundStatusEnum() {
        return new ResponseEntity<>(Arrays.asList(RefundStatusEnum.values()), HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_REFUND_MODE_ENUM)
    public ResponseEntity<?> retrieveAllRefundModeEnum() {
        return new ResponseEntity<>(Arrays.asList(RefundModeEnum.values()), HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_ALL_REFUND_PROGRESS_ENUM)
    public ResponseEntity<?> retrieveAllRefundProgressEnum() {
        return new ResponseEntity<>(Arrays.asList(RefundProgressEnum.values()), HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_REFUND_BY_ID)
    public ResponseEntity<?> retrieveRefundById(@PathVariable Long refundId) throws RefundNotFoundException {
        Refund refund = refundService.retrieveRefundById(refundId);
        clearRefundRelationships(refund);
        return new ResponseEntity<>(refund, HttpStatus.OK);
    }
    @GetMapping(RETRIEVE_ALL_REFUNDS)
    public ResponseEntity<?> retrieveRefundById() throws RefundNotFoundException {
        List<Refund> refunds = refundService.retrieveAllRefunds();
        for(Refund refund : refunds) {
            clearRefundRelationships(refund);
        }
        return new ResponseEntity<>(refunds, HttpStatus.OK);
    }

    private void clearRefundRelationships(Refund refund) {
        refund.getCustomer().setRefunds(null);
        for(RefundLineItem refundLineItem : refund.getRefundLineItems()) {
            refundLineItem.setRefund(null);
            for(RefundLineItemHandler refundLineItemHandler : refundLineItem.getRefundLineItemHandlerList()) {
                refundLineItemHandler.setRefundLineItem(null);
            }
            refundLineItem.getTransactionLineItem().setRefundLineItems(null);
        }
    }
}
