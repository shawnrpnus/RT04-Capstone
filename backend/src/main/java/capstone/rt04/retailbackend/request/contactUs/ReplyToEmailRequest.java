package capstone.rt04.retailbackend.request.contactUs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReplyToEmailRequest {

    private Long contactUsId;

    private String customerEmail;

    private String reply;
}
