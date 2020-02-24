package capstone.rt04.retailbackend.request.product;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.entities.Style;
import capstone.rt04.retailbackend.entities.Tag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductUpdateRequest {

    private Product product;

    private Long categoryId;

    private List<Tag> tags;

    private List<Style> styles;
}
