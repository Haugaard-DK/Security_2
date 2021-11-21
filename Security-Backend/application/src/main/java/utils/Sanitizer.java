package utils;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class Sanitizer {

    private static final int EMAIL_MINIMUM_LENGTH = 6;
    private static final int EMAIL_MAXIMUM_LENGTH = 320;
    private static final int ROLE_MINIMUM_LENGTH = 2;
    private static final int ROLE_MAXIMUM_LENGTH = 255;
    private static final int PASSWORD_MINIMUM_LENGTH = 8; // Passwords shorter than 8 characters are considered to be weak (NIST SP800-63B)
    private static final int PASSWORD_MAXIMUM_LENGTH = 64; // Maximum for BCrypt
    private static final int MESSAGE_MINIMUM_LENGTH = 0;
    private static final int MESSAGE_MAXIMUM_LENGTH = 500;

    public static String username(String input) throws Exception {
        String sanitized = removeSpaces(input);

        boolean validLength = verifyLength(sanitized, EMAIL_MINIMUM_LENGTH, EMAIL_MAXIMUM_LENGTH);
        if (!validLength) {
            throw new Exception("Length Validation Failed");
        }

        List<String> legalCharacters = Arrays.asList("A", "B", "C", "D", "E",
                "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "W", "X", "Y", "Z", "-");
        
        boolean validCharacters = verifyCharacters(sanitized, legalCharacters);
        if (!validCharacters) {
            throw new Exception("Invalid Username");
        }

        return sanitized;
    }

    public static String password(String input) throws Exception {
        String sanitized = removeSpaces(input);

        boolean validLength = verifyLength(sanitized, PASSWORD_MINIMUM_LENGTH, PASSWORD_MAXIMUM_LENGTH);
        if (!validLength) {
            throw new Exception("Length Validation Failed");
        }

        return sanitized;
    }

    public static String role(String input) throws Exception {
        String sanitized = removeSpaces(input);

        boolean validLength = verifyLength(sanitized, ROLE_MINIMUM_LENGTH, ROLE_MAXIMUM_LENGTH);
        if (!validLength) {
            throw new Exception("Length Validation Failed");
        }

        List<String> legalCharacters = Arrays.asList("A", "B", "C", "D", "E",
                "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "W", "X", "Y", "Z", "-");

        boolean validCharacters = verifyCharacters(sanitized, legalCharacters);
        if (!validCharacters) {
            throw new Exception("Illegal Character(s) found");
        }

        return sanitized;
    }
    
    public static String message(String input) throws Exception {
        Boolean validLength = verifyLength(input, MESSAGE_MINIMUM_LENGTH, MESSAGE_MAXIMUM_LENGTH);
        if (!validLength){
            throw new Exception("Length Validation Failed");
        }
        
        List<String> legalCharacters = Arrays.asList("A", "B", "C", "D", "E",
                "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "W", "X", "Y", "Z", "-");
        
        boolean validCharacters = verifyCharacters(input, legalCharacters);
        if (!validCharacters) {
            throw new Exception("Invalid Message");
        }
        
        return input;
    }

    private static String removeSpaces(String input) {
        return input.trim();
    }

    private static boolean verifyLength(String text, int minimum, int maximum) {
        return text.length() >= minimum && text.length() <= maximum;
    }

    private static boolean verifyCharacters(String text, List<String> characters) {
        String textInUpperCase = text.toUpperCase();

        for (char character : textInUpperCase.toCharArray()) {
            if (!characters.contains(String.valueOf(character))) {
                return false;
            }
        }

        return true;
    }

}
