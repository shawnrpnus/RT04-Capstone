package capstone.rt04.retailbackend.request.staff;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffResetPasswordRequest {

    @NotNull
    private Long staffId;

    @NotNull
    private String verificationCode;

    @NotNull
    private String newPassword;
}
