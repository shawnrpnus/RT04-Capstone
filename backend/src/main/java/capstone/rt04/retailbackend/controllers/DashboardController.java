package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.response.ProductDetailsResponse;
import capstone.rt04.retailbackend.services.DashboardService;
import capstone.rt04.retailbackend.util.exceptions.product.ProductNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

import static capstone.rt04.retailbackend.util.routeconstants.DashboardControllerRoutes.DASHBOAR_BASE_ROUTE;
import static capstone.rt04.retailbackend.util.routeconstants.DashboardControllerRoutes.RETRIEVE_MARKET_BASKET_ANALYSIS;

@RestController
@RequestMapping(DASHBOAR_BASE_ROUTE)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping(RETRIEVE_MARKET_BASKET_ANALYSIS)
    public ResponseEntity<?> retrieveMarketBasketAnalysis() throws IOException, ProductNotFoundException {
        List<List<ProductDetailsResponse>> productDetailsResponses = dashboardService.generateMarketBasketAnalysis();
        return new ResponseEntity<>(productDetailsResponses, HttpStatus.OK);
    }
}
