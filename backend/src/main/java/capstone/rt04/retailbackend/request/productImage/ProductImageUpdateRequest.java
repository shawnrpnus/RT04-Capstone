package capstone.rt04.retailbackend.request.productImage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageUpdateRequest {

    @NotNull(message = "Product ID must be provided")
    private Long productId;

    @NotNull(message = "Colour must be provided")
    private String colour;

    @NotNull(message = "Image urls must be provided")
    private List<String> imageUrls;
}
