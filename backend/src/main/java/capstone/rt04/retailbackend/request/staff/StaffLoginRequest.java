package capstone.rt04.retailbackend.request.staff;

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

public class StaffLoginRequest {

    @NotNull(message = ErrorMessages.USERNAME_REQUIRED)
    @Size(min = 1, message = ErrorMessages.USERNAME_REQUIRED)
    private String username;

    @NotNull(message = ErrorMessages.PASSWORD_REQUIRED)
    @Size(min = 1, message = ErrorMessages.PASSWORD_REQUIRED)
    private String password;
}

