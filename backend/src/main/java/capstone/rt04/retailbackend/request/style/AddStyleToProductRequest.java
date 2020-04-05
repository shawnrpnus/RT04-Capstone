package capstone.rt04.retailbackend.request.style;

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
public class AddStyleToProductRequest {

    private Long styleId;

    private List<Long> productIds;
}
