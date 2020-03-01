package capstone.rt04.retailbackend.controllers;

import capstone.rt04.retailbackend.config.PaypalPaymentIntent;
import capstone.rt04.retailbackend.config.PaypalPaymentMethod;
import capstone.rt04.retailbackend.services.PaypalService;
import capstone.rt04.retailbackend.util.URLUtils;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:3000"})
public class PaymentController {

	public static final String PAYPAL_SUCCESS_URL = "pay/success";
	public static final String PAYPAL_CANCEL_URL = "pay/cancel";

	private Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private PaypalService paypalService;

	@RequestMapping(method = RequestMethod.GET)
	public String index(){
		return "index";
	}

	@RequestMapping(method = RequestMethod.POST, value = "pay")
	public ResponseEntity<?> pay(HttpServletRequest request){
		String cancelUrl = URLUtils.getBaseURl(request) + "/" + PAYPAL_CANCEL_URL;
		String successUrl = URLUtils.getBaseURl(request) + "/" + PAYPAL_SUCCESS_URL;
		try {
			Payment payment = paypalService.createPayment(
					1.00,
					"SGD",
					PaypalPaymentMethod.paypal,
					PaypalPaymentIntent.sale,
					"payment description",
					cancelUrl,
					successUrl);

			for(Links links : payment.getLinks()){
				if(links.getRel().equals("approval_url")){
					System.out.println(links.getHref());
					return new ResponseEntity<>(links.getHref(), HttpStatus.OK);
				}
			}
		} catch (PayPalRESTException e) {
			log.error(e.getMessage());
		}
		return new ResponseEntity<>("Internal server error!", HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@RequestMapping(method = RequestMethod.GET, value = PAYPAL_CANCEL_URL)
	public ResponseEntity<?> cancelPay(){
		return new ResponseEntity<>("Payment has been cancelled!", HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.GET, value = PAYPAL_SUCCESS_URL)
	public ResponseEntity<> successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId){
		try {
			Payment payment = paypalService.executePayment(paymentId, payerId);
			if(payment.getState().equals("approved")){
				return new ResponseEntity<>("localhost:3000/user", HttpStatus.OK);
			}
		} catch (PayPalRESTException e) {
			log.error(e.getMessage());
		}
		return new ResponseEntity<>("Unexpected error has occured!", HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
