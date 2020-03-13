package capstone.rt04.retailbackend.request.advertisement;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdvertisementCreateRequest {

    private Long staffId;

    private String advertisementImgUrl;

    private Boolean activate;

}
