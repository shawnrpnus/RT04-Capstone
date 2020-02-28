package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailsResponse {

    private Product product;

    private String leafNodeName;

    private List<ColourToSizeImageMap> colourToSizeImageMaps = new ArrayList<>();

}
