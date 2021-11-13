package security;

import io.jsonwebtoken.impl.crypto.MacProvider;
import javax.crypto.SecretKey;

public class SharedSecret {

    private static SecretKey secret;

    public static SecretKey getSharedKey() {
        if (secret == null) {
            secret = MacProvider.generateKey();
        }

        return secret;
    }

}
