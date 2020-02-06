/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package capstone.rt04.retailbackend.util.security;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 *
 * @author shawn
 */
public class CryptographicHelper {

    private static CryptographicHelper cryptographicHelper = null;
    private static final String SHA256_ALGORITHM_NAME = "SHA-256";
    private static final String DEFAULT_SECURE_RANDOM_ALGORITHM_NAME = "SHA1PRNG";

    public CryptographicHelper() {
    }

    public static CryptographicHelper getInstance() {
        if (cryptographicHelper == null) {
            cryptographicHelper = new CryptographicHelper();
        }

        return cryptographicHelper;
    }
    
    public String doSHA256hashPasswordWithSalt(String password, String salt){
        return bytesToHex(doSHA256Hashing(password + salt));
    }

    public byte[] doSHA256Hashing(String stringToHash) {
        MessageDigest md = null;

        try {
            md = MessageDigest.getInstance(SHA256_ALGORITHM_NAME);
            return md.digest(stringToHash.getBytes());
        } catch (Exception ex) {
            return null;
        }
    }

    public String bytesToHex(byte[] hash) {
        StringBuffer hexString = new StringBuffer();
        for (int i = 0; i < hash.length; i++) {
            String hex = Integer.toHexString(0xff & hash[i]);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public String generateRandomString(int length) {
        String randomString = "";

        try {
            SecureRandom wheel = SecureRandom.getInstance(DEFAULT_SECURE_RANDOM_ALGORITHM_NAME);

            char[] alphaNumberic = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'};

            for (int i = 0; i < length; i++) {
                int random = wheel.nextInt(alphaNumberic.length);
                randomString += alphaNumberic[random];
            }

            return randomString;
        } catch (NoSuchAlgorithmException ex) {
            System.err.println("********** Exception: " + ex);
            return null;
        }
    }

}
