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

public class RegisterPushNotifTokenRequest {

    @NotNull
    Long staffId;

    @NotNull
    String token;

}

