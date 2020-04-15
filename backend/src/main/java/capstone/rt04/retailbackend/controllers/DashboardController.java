package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.services.DashboardService;
import capstone.rt04.retailbackend.services.RelationshipService;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.DashboardControllerRoutes.*;

@RestController
@RequestMapping(DASHBOAR_BASE_ROUTE)
public class DashboardController {

    private final DashboardService dashboardService;
    private final RelationshipService relationshipService;

    public DashboardController(DashboardService dashboardService, RelationshipService relationshipService) {
        this.dashboardService = dashboardService;
        this.relationshipService = relationshipService;
    }

    @GetMapping(RETRIEVE_MARKET_BASKET_ANALYSIS)
    public ResponseEntity<?> retrieveMarketBasketAnalysis() throws IOException, ProductNotFoundException {
        List<List<ProductDetailsResponse>> productDetailsResponses = dashboardService.generateMarketBasketAnalysis();
        for (List<ProductDetailsResponse> response : productDetailsResponses) {
            relationshipService.clearPdrRelationships(response, false);
        }
        return new ResponseEntity<>(productDetailsResponses, HttpStatus.OK);
    }

    @GetMapping(RETRIEVE_LOW_STOCK_PRODUCTS)
    public ResponseEntity<?> retrieveLowStockProducts(@RequestParam(required = false) Long storeId) {
        Integer numOfItems = dashboardService.retrieveLowStockProducts(storeId);
        return new ResponseEntity<>(ResponseEntity.ok(numOfItems), HttpStatus.OK);
    }
}
