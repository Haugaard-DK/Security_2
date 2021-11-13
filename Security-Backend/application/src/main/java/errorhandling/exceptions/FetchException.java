package errorhandling.exceptions;


public class FetchException extends Exception {

    private int errorCode;

    public FetchException(String msg, int errorCode) {
        super(msg);
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }

}
