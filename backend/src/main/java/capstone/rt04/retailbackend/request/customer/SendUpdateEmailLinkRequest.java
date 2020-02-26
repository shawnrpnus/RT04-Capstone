package capstone.rt04.retailbackend.request.customer;

import capstone.rt04.retailbackend.util.ErrorMessages;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SendUpdateEmailLinkRequest {

    @NotNull(message = "Customer Id is required")
    private Long customerId;

    @NotNull(message = ErrorMessages.EMAIL_REQUIRED)
    @Size(min = 1, message = ErrorMessages.EMAIL_REQUIRED)
    @Email
    private String newEmail;
}
