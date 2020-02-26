package capstone.rt04.retailbackend.request.tag;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeleteTagFromProductsRequest {

    private Long tagId;

    private List<Long> productIds;
}
