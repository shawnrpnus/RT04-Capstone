package capstone.rt04.retailbackend.request.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductTagRequest {

    private Long tagId;

    private Long productId;

    private List<Long> tagIds;

    private List<Long> productIds;

    private Boolean isAppend;

}
