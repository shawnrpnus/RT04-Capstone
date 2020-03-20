package capstone.rt04.retailbackend.request.email;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmailRequest {

    private String subject;

    private String content;

    private String instruction;

    private String buttonText;

    private String link;
}
