package capstone.rt04.retailbackend.services;

import capstone.rt04.retailbackend.entities.Reservation;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Timestamp;
import java.time.*;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ReservationServiceTest {
    @Autowired
    private ReservationService reservationService;

    @Test
    public void createAndRetrieveListOfTags() throws Exception {
        //Time received is in Singapore time, but will get parsed as UTC by default
        String testDateTime = "2020-03-18 12:30:00";
        String isoString = testDateTime.replace(" ", "T");
        LocalDateTime ldt = LocalDateTime.parse(isoString);
        ZonedDateTime zonedDateTime= ZonedDateTime.of(ldt, ZoneId.of("Singapore"));
        ZonedDateTime zonedDateTime2= ldt.atZone(ZoneId.of("Singapore"));
        System.out.println(zonedDateTime);
        System.out.println(zonedDateTime.toInstant());
        System.out.println(zonedDateTime2);
        System.out.println(zonedDateTime2.toInstant());
        //Timestamp.toString applies a timezone

        System.out.println(Timestamp.from(zonedDateTime.toInstant()));
        System.out.println(Timestamp.from(zonedDateTime2.toInstant()));

        Timestamp t = reservationService.checkReservationTiming(testDateTime);
        System.out.print(t.toInstant());
        System.out.println(t.toString());
    }

    @Test
    public void testStuff() throws Exception{
        List<Reservation> reservations = reservationService
                .getReservationsFromStoresForLocalTimeWithinDate(
                        LocalTime.of(14, 15), null, null, null);
        for (Reservation r : reservations){
            System.out.println(r.getReservationId());
            System.out.println(r.getReservationDateTime());
        }
    }





}
