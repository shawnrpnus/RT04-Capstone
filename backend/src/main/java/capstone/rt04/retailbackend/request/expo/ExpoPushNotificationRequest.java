package capstone.rt04.retailbackend.request.expo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExpoPushNotificationRequest {

    private List<String> to;
    private Object data;
    private String body;
    private String title;
    private Integer ttl;
    private Long expiration;
    private String priority;
    private String subtitle;
    private String sound;
    private Integer badge;
    private String channelId;


}
