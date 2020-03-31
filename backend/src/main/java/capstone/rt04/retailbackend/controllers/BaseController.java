package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.entities.TransactionLineItem;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.apriori.Apriori;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.MARKET_BASKET_ANALYIS_FILE_PATH;

@RestController
@RequestMapping("/")
public class BaseController {

    private final Apriori apriori;

    private final TransactionService transactionService;
    private final ProductService productService;
    private final RelationshipService relationshipService;

    public BaseController(Apriori apriori, TransactionService transactionService, ProductService productService, RelationshipService relationshipService) {
        this.apriori = apriori;
        this.transactionService = transactionService;
        this.productService = productService;
        this.relationshipService = relationshipService;
    }

    @GetMapping
    public ResponseEntity<?> test() {
        return new ResponseEntity<>("apricot-and-nut backend working", HttpStatus.OK);
    }

    @GetMapping("crazy")
    @Transactional(readOnly = true)
    public ResponseEntity<?> crazy() throws IOException, ProductNotFoundException {
        String data = "";
        List<Transaction> transactions = transactionService.retrieveAllTransaction();
        List<Long> productIds = new ArrayList<>();
        for (Transaction transaction : transactions) {
            productIds.clear();
            for (TransactionLineItem item : transaction.getTransactionLineItems()) {
                if (!productIds.contains(item.getProductVariant().getProduct().getProductId())) {
                    productIds.add(item.getProductVariant().getProduct().getProductId());
                }
            }
            Collections.sort(productIds);
            for (Long productId : productIds) {
                data += productId + " ";
            }
            data += "\n";
        }


        OutputStream os = null;
        try {
            os = new FileOutputStream(new File(MARKET_BASKET_ANALYIS_FILE_PATH));
            os.write(data.getBytes(), 0, data.length());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                os.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        List<List<ProductDetailsResponse>> bigOof = new ArrayList<>();
        List<List<Long>> transactionIdsList = apriori.performBasketAnalysis();
        for (List<Long> list : transactionIdsList) {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(null,
                    null, productService.retrieveListOfProductsById(list));
            bigOof.add(products);
        }

        for (List<ProductDetailsResponse> response : bigOof) {
            relationshipService.clearPdrRelationships(response, false);
        }

        return new ResponseEntity<>(bigOof, HttpStatus.OK);
    }

}
