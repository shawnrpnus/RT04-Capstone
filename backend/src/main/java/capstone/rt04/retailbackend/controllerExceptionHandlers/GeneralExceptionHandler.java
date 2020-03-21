package capstone.rt04.retailbackend.controllerExceptionHandlers;

import capstone.rt04.retailbackend.response.GenericErrorResponse;
import capstone.rt04.retailbackend.util.exceptions.InputDataValidationException;
import capstone.rt04.retailbackend.util.exceptions.advertisement.AdvertisementNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CategoryNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.category.CreateNewCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.DeleteCategoryException;
import capstone.rt04.retailbackend.util.exceptions.category.UpdateCategoryException;
import capstone.rt04.retailbackend.util.exceptions.contactUs.ContactUsNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.customer.*;
import capstone.rt04.retailbackend.util.exceptions.delivery.DeliveryHasAlreadyBeenConfirmedException;
import capstone.rt04.retailbackend.util.exceptions.discount.DiscountNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderItemNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InStoreRestockOrderUpdateException;
import capstone.rt04.retailbackend.util.exceptions.inStoreRestockOrder.InsufficientStockException;
import capstone.rt04.retailbackend.util.exceptions.instagramPost.InstagramPostNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.product.*;
import capstone.rt04.retailbackend.util.exceptions.reservation.CreateNewReservationException;
import capstone.rt04.retailbackend.util.exceptions.reservation.ReservationNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.review.ReviewNotUpdatedException;
import capstone.rt04.retailbackend.util.exceptions.shoppingcart.InvalidCartTypeException;
import capstone.rt04.retailbackend.util.exceptions.staff.CreateNewStaffAccountException;
import capstone.rt04.retailbackend.util.exceptions.staff.StaffNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.store.StoreNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.CreateNewStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.DeleteStyleException;
import capstone.rt04.retailbackend.util.exceptions.style.StyleNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.style.UpdateStyleException;
import capstone.rt04.retailbackend.util.exceptions.tag.CreateNewTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.DeleteTagException;
import capstone.rt04.retailbackend.util.exceptions.tag.TagNotFoundException;
import capstone.rt04.retailbackend.util.exceptions.tag.UpdateTagException;
import capstone.rt04.retailbackend.util.exceptions.warehouse.WarehouseNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice //global exception handler for controllers (methods with a @RequestMapping etc annotation)
@RestController
public class GeneralExceptionHandler extends ResponseEntityExceptionHandler {


    @Override
    public final ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, String> errorMsg = new HashMap<>();
        errorMsg.put("message", "Your input is invalid!");
        return new ResponseEntity<>(errorMsg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public final ResponseEntity<Object> handleInputDataValidationException(InputDataValidationException ex, WebRequest req) {
        return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({
            CreateNewCustomerException.class, CustomerCannotDeleteException.class,
            CreateNewStyleException.class, UpdateStyleException.class, DeleteStyleException.class,
            CreateNewTagException.class, DeleteTagException.class, UpdateTagException.class,
            CreateNewCategoryException.class, UpdateCategoryException.class, DeleteCategoryException.class
    })
    public final ResponseEntity<Object> handlePersistenceExceptions(Exception ex, WebRequest req) {
        return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({
            CustomerNotFoundException.class, CreditCardNotFoundException.class,
            AddressNotFoundException.class, ProductVariantNotFoundException.class,
            StyleNotFoundException.class, TagNotFoundException.class, CategoryNotFoundException.class,
            ProductNotFoundException.class, ProductStockNotFoundException.class, WarehouseNotFoundException.class,
            StoreNotFoundException.class, VerificationCodeNotFoundException.class, AlreadyVerifiedException.class,
            ProductImageNotFoundException.class, ProductVariantNotFoundException.class, ReservationNotFoundException.class,
            StyleNotFoundException.class, ContactUsNotFoundException.class, InStoreRestockOrderNotFoundException.class,
            AdvertisementNotFoundException.class, InStoreRestockOrderItemNotFoundException.class,
            InstagramPostNotFoundException.class, ReviewNotFoundException.class, DiscountNotFoundException.class,
            StaffNotFoundException.class
    })
    public final ResponseEntity<Object> handleNotFoundExceptions(Exception ex, WebRequest req) {
        return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public final ResponseEntity<Object> handleInvalidLogin(InvalidLoginCredentialsException ex, WebRequest req) {
        return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    public final ResponseEntity<Object> handleCustomerNotVerified(CustomerNotVerifiedException ex, WebRequest req) {
        return new ResponseEntity<>(ex.getErrorMap(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({
            VerificationCodeExpiredException.class, InvalidCartTypeException.class, WishlistException.class, CreateNewReservationException.class,
            DeleteProductVariantException.class, InStoreRestockOrderUpdateException.class, InsufficientStockException.class, CreateNewStaffAccountException.class,
            DeliveryHasAlreadyBeenConfirmedException.class, ReviewNotUpdatedException.class
    })
    public final ResponseEntity<Object> handleBadRequestExceptions(Exception ex, WebRequest req) {
        return new ResponseEntity<>(new GenericErrorResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
