package capstone.rt04.retailbackend.response;

import capstone.rt04.retailbackend.entities.Category;
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
public class AllCategoryTagResponse {

    private List<Category> categories;

    private List<Tag> tags;

}
