package capstone.rt04.retailbackend.request.customer;

import capstone.rt04.retailbackend.util.ErrorMessages;
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
public class UpdateCustomerRequest {

    @NotNull(message = "Customer Id required")
    private Long customerId;

    @NotNull(message = ErrorMessages.FIRST_NAME_REQUIRED)
    @Size(min = 1, message = ErrorMessages.FIRST_NAME_REQUIRED)
    private String firstName;

    @NotNull(message = ErrorMessages.LAST_NAME_REQUIRED)
    @Size(min = 1, message = ErrorMessages.LAST_NAME_REQUIRED)
    private String lastName;
}
