package capstone.rt04.retailbackend.request.product;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreateRequest {

    private Product product;

    private Long categoryId;

    private List<Long> tagIds;

    private List<Long> styleIds;

    private List<SizeEnum> sizes;

    private List<ColourToImageUrlsMap> colourToImageUrlsMaps;
}
