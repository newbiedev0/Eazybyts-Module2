package tool;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;
import javax.crypto.SecretKey;
import io.jsonwebtoken.SignatureAlgorithm; 

public class KeyGenerator {
    public static void main(String[] args) {
       
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256); 
        String base64EncodedKey = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Generated HS256 Secret Key (Base64 Encoded): " + base64EncodedKey);

        // Or for HS512, generate a 512-bit (64-byte) key
        SecretKey keyHs512 = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String base64EncodedKeyHs512 = Encoders.BASE64.encode(keyHs512.getEncoded());
        System.out.println("Generated HS512 Secret Key (Base64 Encoded): " + base64EncodedKeyHs512);
    }
}
