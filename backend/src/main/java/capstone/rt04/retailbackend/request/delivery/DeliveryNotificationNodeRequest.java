package capstone.rt04.retailbackend.request.delivery;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryNotificationNodeRequest {

    private String orderNumber;

    private String email;

    private String fullName;

    private String store;
}
