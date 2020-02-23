package capstone.rt04.retailbackend.response;

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
public class AllCategoryTagStyleResponse {

    private List<CategoryDetails> categories;

    private List<Tag> tags;

    private List<Style> styles;

}
