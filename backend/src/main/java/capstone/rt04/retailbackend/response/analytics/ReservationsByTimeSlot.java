package capstone.rt04.retailbackend.response.analytics;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.HashMap;

@Getter
@Setter
@Slf4j
public class ReservationsByTimeSlot {

    private LocalTime timeSlot;

    private BigDecimal averageReservations;

    private Integer totalReservations;

    private HashMap<String, Object> storeReservationsData;

    public ReservationsByTimeSlot(LocalTime timeSlot, Integer totalReservations) {
        this.timeSlot = timeSlot;
        this.totalReservations = totalReservations;
        this.storeReservationsData = new HashMap<>();
    }

    public ReservationsByTimeSlot(LocalTime timeSlot, BigDecimal averageReservations, Integer totalReservations) {
        this.timeSlot = timeSlot;
        this.averageReservations = averageReservations;
        this.totalReservations = totalReservations;
        this.storeReservationsData = new HashMap<>();
    }

    public void setTotalReservationsForStore(Long storeId, Integer total){
        String key = storeId + "-totalReservations";
        this.storeReservationsData.put(key, total);
    }

    public void setAverageReservationsForStore(Long storeId, BigDecimal average){
        String key = storeId + "-averageReservations";
        this.storeReservationsData.put(key, average);
    }
}
