package capstone.rt04.retailbackend.request.staff;

import capstone.rt04.retailbackend.util.ErrorMessages;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffChangePasswordRequest {

    @NotNull
    private Long staffId;

    @NotNull(message = ErrorMessages.OLD_PASSWORD_REQUIRED)
    private String oldPassword;

    @NotNull(message = ErrorMessages.NEW_PASSWORD_REQUIRED)
    private String newPassword;
}
