package capstone.rt04.retailbackend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class BaseController {

    @GetMapping
    public ResponseEntity<?> test(){
        return new ResponseEntity<>("apricot-and-nut backend working", HttpStatus.OK);
    }

}
