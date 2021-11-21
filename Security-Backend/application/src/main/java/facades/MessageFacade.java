package facades;

import DTOs.MessageDTO;
import entities.Message;
import entities.User;
import errorhandling.exceptions.DatabaseException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import utils.Sanitizer;


public class MessageFacade {
    
    private static EntityManagerFactory emf;
    private static MessageFacade instance;
    
    private MessageFacade() {
        // Private constructor to ensure Singleton
    }

    public static MessageFacade getMessageFacade(EntityManagerFactory _emf) {
        if (instance == null) {
            emf = _emf;
            instance = new MessageFacade();
        }

        return instance;
    }

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }
    
    public MessageDTO createMessage(String messageText, User user) throws DatabaseException, Exception {
        messageText = Sanitizer.message(messageText);
        
        EntityManager em = getEntityManager();
        
        Message message = new Message(messageText, user); 
        
        try {

            em.getTransaction().begin();
            em.persist(message);
            em.getTransaction().commit();

            return new MessageDTO(message);
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }

            throw new DatabaseException("Something went wrong! Failed to create message, please try again later.");
        } finally {
            em.close();
        }
        
    }

    public List<MessageDTO> getAllMessages() {
        EntityManager em = getEntityManager();

        List<Message> messages;
        List<MessageDTO> messageDTOs = new ArrayList<>();

        try {
            Query query = em.createNamedQuery("Message.getAll");
            messages = query.getResultList();

            messages.forEach(message -> {
                messageDTOs.add(new MessageDTO(message));
            });

            return messageDTOs;
        }
       
         finally {
            em.close();
        }
    }

}
