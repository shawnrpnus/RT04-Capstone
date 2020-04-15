package capstone.rt04.retailbackend.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Slf4j
public class SalesByDay {

    private LocalDate date;

    private BigDecimal averageTotalSales;

    private BigDecimal totalSales;

    private Integer totalTransactions;

    private HashMap<String, Object> pointOfPurchaseData;

    public SalesByDay() {
        this.averageTotalSales = BigDecimal.ZERO;
        this.totalSales = BigDecimal.ZERO;
        this.totalTransactions = 0;
        pointOfPurchaseData = new HashMap<>();
    }

    public SalesByDay(LocalDate date, BigDecimal averageTotalSales, BigDecimal totalSales, Integer totalTransactions, HashMap<String, Object> pointOfPurchaseData) {
        this.date = date;
        this.averageTotalSales = averageTotalSales;
        this.totalSales = totalSales;
        this.totalTransactions = totalTransactions;
        this.pointOfPurchaseData = pointOfPurchaseData;
    }

    public void addToTotalSales(BigDecimal valueToAdd) {
        this.totalSales = this.totalSales.add(valueToAdd);
    }

    public void incrementTotalTransactions() {
        this.totalTransactions = this.totalTransactions + 1;
    }

    public SalesByDay createCopy() {
        HashMap<String, Object> popDataCopy = new HashMap<>(this.pointOfPurchaseData);
        return new SalesByDay(this.date, this.averageTotalSales, this.totalSales, this.totalTransactions, popDataCopy);
    }

    public void calculateAverageTotalSales() {
//        log.info("Total Sales: " + this.totalSales);
//        log.info("Total Txns: " + this.totalTransactions);
        this.averageTotalSales = this.totalSales.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_EVEN);
    }


    public void addTotalSalesForStore(Long storeId, BigDecimal finalTotalPrice) {
        String key = storeId + "-totalSales";
        addTotalSalesForKey(key, finalTotalPrice);
    }

    public void incrementTotalTransactionsForStore(Long storeId) {
        String key = storeId + "-totalTransactions";
        incrementTotalSalesForKey(key);
    }

    public void calculateAverageTotalSalesForStore(Long storeId){
        calculateAverageTotalSalesForPoP(storeId.toString());
    }


    public void addTotalSalesForOnline(BigDecimal finalTotalPrice) {
        String key = "online-totalSales";
        addTotalSalesForKey(key, finalTotalPrice);
    }

    public void incrementTotalTransactionsForOnline() {
        String key = "online-totalTransactions";
        incrementTotalSalesForKey(key);
    }

    public void calculateAverageTotalSalesForOnline(){
        calculateAverageTotalSalesForPoP("online");
    }


    private void addTotalSalesForKey(String key, BigDecimal finalTotalPrice) {
        if (this.pointOfPurchaseData.get(key) == null) {
            //first time adding for store
            this.pointOfPurchaseData.put(key, finalTotalPrice);
        } else {
            BigDecimal currentTotal = (BigDecimal) this.pointOfPurchaseData.get(key);
            BigDecimal newTotal = currentTotal.add(finalTotalPrice);
            this.pointOfPurchaseData.put(key, newTotal);
        }
    }

    private void incrementTotalSalesForKey(String key) {
        if (this.pointOfPurchaseData.get(key) == null) {
            //first time incrementing for store
            this.pointOfPurchaseData.put(key, 1);
        } else {
            Integer currentTotal = (Integer) this.pointOfPurchaseData.get(key);
            this.pointOfPurchaseData.put(key, currentTotal + 1);
        }
    }

    private void calculateAverageTotalSalesForPoP(String id) { //id is storeId or "online"
        String totalSalesKey = id + "-totalSales";
        String totalTransactionsKey = id + "-totalTransactions";
        if (this.pointOfPurchaseData.get(totalSalesKey) != null
                && this.pointOfPurchaseData.get(totalTransactionsKey) != null){
            BigDecimal totalSales = (BigDecimal) this.pointOfPurchaseData.get(totalSalesKey);
            Integer totalTransactions = (Integer) this.pointOfPurchaseData.get(totalTransactionsKey);
            BigDecimal averageTotalSales = totalSales.divide(BigDecimal.valueOf(totalTransactions), RoundingMode.HALF_EVEN);
            String key = id + "-averageTotalSales";
            this.pointOfPurchaseData.put(key, averageTotalSales);
        }
    }

}
