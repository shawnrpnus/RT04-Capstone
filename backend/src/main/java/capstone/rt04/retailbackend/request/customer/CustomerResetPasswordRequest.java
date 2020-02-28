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
public class CustomerResetPasswordRequest {

    @NotNull
    private String verificationCode;

    @NotNull
    @Size(min = 1, message = ErrorMessages.NEW_PASSWORD_REQUIRED)
    private String newPassword;

    @NotNull
    @Size(min = 1, message = ErrorMessages.CONFIRM_NEW_PASSWORD_REQUIRED)
    private String confirmNewPassword;
}
