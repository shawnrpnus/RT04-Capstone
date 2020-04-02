package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.entities.Transaction;
import capstone.rt04.retailbackend.entities.TransactionLineItem;
import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.services.AprioriService;
import capstone.rt04.retailbackend.services.ProductService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.services.TransactionService;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static capstone.rt04.retailbackend.util.Constants.DEV_MARKET_BASKET_ANALYIS_FILE_PATH;
import static capstone.rt04.retailbackend.util.routeconstants.DashboardControllerRoutes.DASHBOAR_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.DashboardControllerRoutes.RETRIEVE_MARKET_BASKET_ANALYSIS;

@RestController
@RequestMapping(DASHBOAR_BASE_ROUTE)
public class DashboardController {

    private final AprioriService aprioriService;

    private final TransactionService transactionService;
    private final ProductService productService;
    private final RelationshipService relationshipService;

    @Value("transactionIds.txt")
    private ClassPathResource resource;

    public DashboardController(AprioriService aprioriService, TransactionService transactionService, ProductService productService, RelationshipService relationshipService) {
        this.aprioriService = aprioriService;
        this.transactionService = transactionService;
        this.productService = productService;
        this.relationshipService = relationshipService;
    }

    @GetMapping(RETRIEVE_MARKET_BASKET_ANALYSIS)
    @Transactional(readOnly = true)
    public ResponseEntity<?> retrieveMarketBasketAnalysis() throws IOException, ProductNotFoundException {
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

        System.out.println("***************************************************\n\n\n");

        String jarPath = "";
        String MARKET_BASKET_ANALYSIS_FILE_PATH = "";
        OutputStream out = null;
        try {
            System.out.println(getClass().getProtectionDomain().getCodeSource().getLocation().getPath());
            jarPath = URLDecoder.decode(getClass().getProtectionDomain().getCodeSource().getLocation().getPath(), "UTF-8");
            System.out.println(jarPath);
        } catch (UnsupportedEncodingException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }

        try {
            MARKET_BASKET_ANALYSIS_FILE_PATH = (jarPath.substring(0, jarPath.lastIndexOf("retail"))
                    + "transactionIds.txt").substring(6);
            System.out.println("***** jar try");
        } catch (NullPointerException | StringIndexOutOfBoundsException ex) {
            MARKET_BASKET_ANALYSIS_FILE_PATH = DEV_MARKET_BASKET_ANALYIS_FILE_PATH;
            System.out.println("***** jar catch");
        }

        System.out.println(MARKET_BASKET_ANALYSIS_FILE_PATH);

        File f = new File(MARKET_BASKET_ANALYSIS_FILE_PATH);

        System.out.println("F - " + f.getPath());
        System.out.println("F abs - " + f.getAbsolutePath());
        System.out.println("F name - " + f.getName());

        try {
            out = new FileOutputStream(f);
            System.out.println(out);
            out.write(data.getBytes(), 0, data.length());
        } catch (Exception e) {
            System.err.println(e.getMessage());

            MARKET_BASKET_ANALYSIS_FILE_PATH = (jarPath + "transactionIds.txt").substring(6);

            System.out.println("MBA - " + MARKET_BASKET_ANALYSIS_FILE_PATH);

            out = new FileOutputStream(f);
            out.write(data.getBytes(), 0, data.length());
            try {
                out.close();
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }
        }

        System.out.println("\n\n\n***************************************************");

        List<List<ProductDetailsResponse>> productDetailsResponses = new ArrayList<>();
        List<List<Long>> transactionIdsList = aprioriService.performBasketAnalysis(MARKET_BASKET_ANALYSIS_FILE_PATH);
        for (List<Long> list : transactionIdsList) {
            List<ProductDetailsResponse> products = productService.retrieveProductsDetails(null,
                    null, productService.retrieveListOfProductsById(list));
            productDetailsResponses.add(products);
        }

        for (List<ProductDetailsResponse> response : productDetailsResponses) {
            relationshipService.clearPdrRelationships(response, false);
        }

        return new ResponseEntity<>(productDetailsResponses, HttpStatus.OK);
    }
}
