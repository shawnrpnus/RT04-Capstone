package capstone.rt04.retailbackend.request.algolia;

import capstone.rt04.retailbackend.entities.Product;
import capstone.rt04.retailbackend.response.ColourToSizeImageMap;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class AlgoliaProductDetailsResponse {

    private Long objectID;

    private Product product;

    private String leafNodeName;

    private List<ColourToSizeImageMap> colourToSizeImageMaps = new ArrayList<>();

}
