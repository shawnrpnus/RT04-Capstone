package capstone.rt04.retailbackend.request.product;

import capstone.rt04.retailbackend.entities.Category;
import capstone.rt04.retailbackend.entities.Tag;
import capstone.rt04.retailbackend.util.enums.SizeEnum;
import capstone.rt04.retailbackend.util.enums.SortEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRetrieveRequest {

    private Category category;

    private List<Tag> tags;

    private List<String> colours;

    private List<SizeEnum> sizes;

    @Min(value = 1)
    private BigDecimal minPrice;

    @Min(value = 1)
    private BigDecimal maxPrice;

    private SortEnum sortEnum;
}
