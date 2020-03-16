package capstone.rt04.retailbackend.request.instagramPost;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InstagramPostUpdateRequest {

    private Long instagramPostId;

    private List<Long> productIds;

}
