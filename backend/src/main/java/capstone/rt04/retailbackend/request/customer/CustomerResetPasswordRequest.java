package capstone.rt04.retailbackend.request.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResetPasswordRequest {

    @NotNull
    private Long customerId;

    @NotNull
    private String verificationCode;

    @NotNull
    private String newPassword;
}
