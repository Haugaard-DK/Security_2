package rest;

import DTOs.RoleDTO;
import DTOs.UserDTO;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import facades.UserFacade;
import java.util.Date;
import java.util.List;
import errorhandling.exceptions.API_Exception;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import errorhandling.exceptions.AuthenticationException;
import errorhandling.exceptions.DatabaseException;
import errorhandling.exceptions.UserCreationException;
import java.text.ParseException;
import javax.persistence.EntityManagerFactory;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import security.SharedSecret;
import utils.EMF_Creator;
import utils.GoogleRecaptcha;

@Path("auth")
public class AuthenticationResource {

    public static final long TOKEN_EXPIRE_TIME = TimeUnit.MILLISECONDS.convert(30, TimeUnit.MINUTES);
    private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
    public static final UserFacade USER_FACADE = UserFacade.getUserFacade(EMF);
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();

    @Context
    ContainerRequestContext requestContext;

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(String jsonString) throws AuthenticationException, API_Exception, Exception {
        String username, password;
        JsonObject jsonObject = new JsonObject();

        try {
            GoogleRecaptcha.verify(requestContext);
        } catch (Exception e) {
            throw e;
        }

        try {
            JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
            username = json.get("userName").getAsString();
            password = json.get("password").getAsString();
        } catch (Exception e) {
            throw new API_Exception("Malformed JSON Suplied", 400, e);
        }

        try {
            UserDTO user = USER_FACADE.login(username, password);
            String token = createToken(user);

            // Preparing respone
            jsonObject.addProperty("userName", user.getUserName());
            jsonObject.addProperty("token", token);

            return Response.ok(GSON.toJson(jsonObject)).build();
        } catch (JOSEException | AuthenticationException e) {
            if (e instanceof AuthenticationException) {
                throw (AuthenticationException) e;
            }

            throw new API_Exception("Something went wrong, please try again later ...");
        }
    }

    @POST
    @Path("register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(String jsonString) throws AuthenticationException, API_Exception, DatabaseException, UserCreationException, Exception {
        String username, password;
        JsonObject jsonObject = new JsonObject();
        
        try {
            GoogleRecaptcha.verify(requestContext);
        } catch (Exception e) {
            throw e;
        }

        try {
            JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
            username = json.get("userName").getAsString();
            password = json.get("password").getAsString();
        } catch (Exception e) {
            throw new API_Exception("Malformed JSON Suplied", 400, e);
        }

        try {
            UserDTO user = USER_FACADE.createUser(username, password);
            String token = createToken(user);

            // Preparing respone
            jsonObject.addProperty("userName", user.getUserName());
            jsonObject.addProperty("token", token);

            return Response.ok(GSON.toJson(jsonObject)).build();
        } catch (JOSEException | DatabaseException | UserCreationException e) {
            if (e instanceof DatabaseException) {
                throw (DatabaseException) e;
            } else if (e instanceof UserCreationException) {
                throw (UserCreationException) e;
            }

            throw new API_Exception("Something went wrong, please try again later ...");
        }
    }

    private String createToken(UserDTO user) throws JOSEException {
        List<String> roles = new ArrayList<>();

        for (RoleDTO role : user.getRoleList()) {
            roles.add(role.getRoleName());
        }

        Date date = new Date();
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName())
                .claim("username", user.getUserName())
                .claim("roles", String.join(",", roles))
                .issuer("MatChat")
                .issueTime(date)
                .expirationTime(new Date(date.getTime() + TOKEN_EXPIRE_TIME))
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
        signedJWT.sign(new MACSigner(SharedSecret.getSharedKey()));

        return signedJWT.serialize();
    }

    protected static String getUserFromToken(ContainerRequestContext crc) throws ParseException {
        String token = crc.getHeaderString("x-access-token");
        SignedJWT jwt = SignedJWT.parse(token);
        String username = jwt.getJWTClaimsSet().getClaim("username").toString();

        return username;
    }

}
