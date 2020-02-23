package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDetails {

    private Category category;

    private String leafNodeName;

}
