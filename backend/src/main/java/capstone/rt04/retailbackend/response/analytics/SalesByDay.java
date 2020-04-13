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

@Getter
@Setter
@Slf4j
public class SalesByDay {

    private LocalDate date;

    private BigDecimal averageTotalSales;

    private BigDecimal totalSales;

    private Integer totalTransactions;

    public SalesByDay() {
        this.averageTotalSales = BigDecimal.ZERO;
        this.totalSales = BigDecimal.ZERO;
        this.totalTransactions = 0;
    }

    public SalesByDay(LocalDate date, BigDecimal averageTotalSales, BigDecimal totalSales, Integer totalTransactions) {
        this.date = date;
        this.averageTotalSales = averageTotalSales;
        this.totalSales = totalSales;
        this.totalTransactions = totalTransactions;
    }

    public void addToTotalSales(BigDecimal valueToAdd){
        this.totalSales = this.totalSales.add(valueToAdd);
    }

    public void incrementTotalTransactions(){
        this.totalTransactions = this.totalTransactions + 1;
    }

    public SalesByDay createCopy(){
        return new SalesByDay(this.date, this.averageTotalSales, this.totalSales, this.totalTransactions);
    }

    public void calculateAverageTotalSales(){
//        log.info("Total Sales: " + this.totalSales);
//        log.info("Total Txns: " + this.totalTransactions);
        this.averageTotalSales = this.totalSales.divide(BigDecimal.valueOf(totalTransactions), RoundingMode.HALF_EVEN);
    }
}
