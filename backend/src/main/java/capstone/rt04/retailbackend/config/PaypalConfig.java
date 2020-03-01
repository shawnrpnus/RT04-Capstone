package capstone.rt04.retailbackend.config;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PaypalConfig {

	@Value("${paypal.client.app}")
    private String clientId;
	@Value("${paypal.client.secret}")
    private String clientSecret;
	@Value("${paypal.mode}")
    private String mode;
    
	@Bean
	public Map<String, String> paypalSdkConfig(){
		Map<String, String> sdkConfig = new HashMap<>();
		sdkConfig.put("mode", mode);
		return sdkConfig;
	}
	
	@Bean
	public OAuthTokenCredential authTokenCredential() throws PayPalRESTException {
		OAuthTokenCredential token = new OAuthTokenCredential(clientId, clientSecret, paypalSdkConfig());
		return token;
	}
	
	@Bean
	public APIContext apiContext() throws PayPalRESTException{
		APIContext apiContext = new APIContext(authTokenCredential().getAccessToken());
		apiContext.setConfigurationMap(paypalSdkConfig());
		return apiContext;
	}
}
