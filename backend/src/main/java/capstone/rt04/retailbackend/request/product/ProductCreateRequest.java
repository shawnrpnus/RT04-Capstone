package capstone.rt04.retailbackend.request.product;

import capstone.rt04.retailbackend.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCreateRequest {

    private Product product;

    private Long categoryId;
}
