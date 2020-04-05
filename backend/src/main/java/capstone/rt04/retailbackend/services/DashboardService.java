package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.entities.TransactionLineItem;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.DEV_MARKET_BASKET_ANALYIS_FILE_PATH;

@Service
public class DashboardService {

    private final AprioriService aprioriService;

    private final TransactionService transactionService;
    private final ProductService productService;
    private final RelationshipService relationshipService;

    public DashboardService(AprioriService aprioriService, TransactionService transactionService, ProductService productService, RelationshipService relationshipService) {
        this.aprioriService = aprioriService;
        this.transactionService = transactionService;
        this.productService = productService;
        this.relationshipService = relationshipService;
    }

    @Transactional(readOnly = true)
    public List<List<ProductDetailsResponse>> generateMarketBasketAnalysis() throws ProductNotFoundException, IOException {
        String data = "";
        List<Transaction> transactions = transactionService.retrieveAllTransaction();
        List<Long> productIds = new ArrayList<>();
        for (Transaction transaction : transactions) {
            // remove all single purchase for better representation of basket analysis
            if (transaction.getTransactionLineItems().size() <= 1) continue;
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
        File file = new File(DEV_MARKET_BASKET_ANALYIS_FILE_PATH);
        Boolean dev = Boolean.TRUE;

        try {
            // try to write to file (development)
            os = new FileOutputStream(file);
            os.write(data.getBytes(), 0, data.length());
        } catch (Exception ex) {
            dev = Boolean.FALSE;
//            ex.printStackTrace();
        } finally {
            try {
                os.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        List<List<ProductDetailsResponse>> productDetailsResponses = new ArrayList<>();
        List<List<Long>> transactionIdsList;
        if (dev) {
            transactionIdsList = aprioriService.performBasketAnalysis(DEV_MARKET_BASKET_ANALYIS_FILE_PATH, null);
        } else {
            transactionIdsList = aprioriService.performBasketAnalysis(null, data);
        }

        for (List<Long> list : transactionIdsList) {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(null,
                    null, productService.retrieveListOfProductsById(list));
            productDetailsResponses.add(products);
        }

        for (List<ProductDetailsResponse> response : productDetailsResponses) {
            relationshipService.clearPdrRelationships(response, false);
        }
        return productDetailsResponses;
    }
}
