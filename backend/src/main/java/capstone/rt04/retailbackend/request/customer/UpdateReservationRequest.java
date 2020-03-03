package capstone.rt04.retailbackend.request.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateReservationRequest {

    @NotNull
    Long reservationId;

    @NotNull
    Long newStoreId;

    @NotNull
    @Size(min = 1, message="Reservation date/time required")
    String newReservationDateTime;
}
