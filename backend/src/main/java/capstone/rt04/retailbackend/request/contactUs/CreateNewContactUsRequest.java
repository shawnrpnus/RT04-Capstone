package capstone.rt04.retailbackend.request.contactUs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateNewContactUsRequest {
    private String contactUsCategory;
    private String content;
    private String customerEmail;
    private String firstName;
    private String lastName;

}
