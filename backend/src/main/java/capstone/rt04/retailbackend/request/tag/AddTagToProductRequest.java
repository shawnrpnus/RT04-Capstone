package capstone.rt04.retailbackend.request.tag;

import capstone.rt04.retailbackend.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddTagToProductRequest {

    private Long tagId;

    private List<Product> products;
}
