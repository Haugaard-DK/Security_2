package rest;

import DTOs.MessageDTO;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import entities.User;
import errorhandling.exceptions.API_Exception;
import errorhandling.exceptions.DatabaseException;
import errorhandling.exceptions.UserNotFoundException;
import facades.MessageFacade;
import facades.UserFacade;
import java.text.ParseException;
import java.util.List;
import javax.annotation.security.RolesAllowed;
import javax.persistence.EntityManagerFactory;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import utils.EMF_Creator;

@Path("message")
public class MessageResource {

    private static final EntityManagerFactory EMF = EMF_Creator.createEntityManagerFactory();
    private static final MessageFacade FACADE = MessageFacade.getMessageFacade(EMF);
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final UserFacade USER_FACADE = UserFacade.getUserFacade(EMF);

    @Context
    private UriInfo context;

    @Context
    SecurityContext securityContext;
    
    @Context
    ContainerRequestContext crc;

    @POST
    @Path("postMessage")
    @RolesAllowed("User")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postMessage(String jsonString) throws DatabaseException, API_Exception, ParseException, UserNotFoundException {
        String messageText;
        JsonObject jsonObject = new JsonObject();
        String stringUsername = AuthenticationResource.getUserFromToken(crc);
        
        User user = USER_FACADE.getUserByUsername(stringUsername);
        
        try {
            JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
            messageText = json.get("messageText").getAsString();
        } catch (Exception e) {
            throw new API_Exception("Malformed JSON Suplied", 400, e);
        }

        try {
            MessageDTO message = FACADE.createMessage(messageText, user);

            // Preparing respone
            jsonObject.addProperty("messageText", message.getMessageText());

            return Response.ok(GSON.toJson(jsonObject)).build();
        } catch (Exception e) {
            System.out.println(e);

            throw new API_Exception("Something went wrong, please try again later ...");
        }
        
    }
    
    @GET
    @Path("allMessages")
    @RolesAllowed("User")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMessages() throws UserNotFoundException, ParseException {
        String stringUsername = AuthenticationResource.getUserFromToken(crc);
        
        User user = USER_FACADE.getUserByUsername(stringUsername);
        
        List<MessageDTO> messages = FACADE.getAllMessages(user);
        return Response.ok(messages).build();
    }
    
    
}
