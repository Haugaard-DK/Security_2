package facades;

import DTOs.UserDTO;
import entities.Role;
import entities.User;
import errorhandling.exceptions.DatabaseException;
import errorhandling.exceptions.UserCreationException;
import errorhandling.exceptions.UserNotFoundException;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import errorhandling.exceptions.AuthenticationException;
import utils.Sanitizer;

public class UserFacade {

    private static EntityManagerFactory emf;
    private static UserFacade instance;
    private static RoleFacade roleFacade;

    private UserFacade() {
        // Private constructor to ensure Singleton
    }

    public static UserFacade getUserFacade(EntityManagerFactory _emf) {
        if (instance == null) {
            emf = _emf;
            roleFacade = RoleFacade.getRoleFacade(emf);
            instance = new UserFacade();
        }

        return instance;
    }

    private EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public UserDTO createUser(String username, String password) throws DatabaseException, UserCreationException, Exception {
        username = Sanitizer.username(username);
        password = Sanitizer.password(password);
        
        if (username.isEmpty() || password.isEmpty()) {
            throw new UserCreationException("Not all user credentials was provided.");
        }

        EntityManager em = getEntityManager();

        List<Role> defaultRoles = roleFacade.getDefaultRoles();

        User user = new User(username, password, defaultRoles);

        try {
            // Checking if username is in use
            if (em.find(User.class, username) != null) {
                throw new UserCreationException("Username already in use.");
            }

            em.getTransaction().begin();
            em.persist(user);

            for (Role role : user.getRoles()) {
                em.merge(role);
            }

            em.getTransaction().commit();

            return new UserDTO(user);
        } catch (Exception e) {
            if (e instanceof UserCreationException) {
                throw e;
            }

            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }

            throw new DatabaseException("Something went wrong! Failed to create user, please try again later.");
        } finally {
            em.close();
        }
    }

    public UserDTO login(String userName, String password) throws AuthenticationException, Exception {
        userName = Sanitizer.username(userName);
        password = Sanitizer.password(password);
        
        EntityManager em = getEntityManager();

        try {
            User user = em.find(User.class, userName);

            if (user == null || !user.verifyPassword(password)) {
                throw new AuthenticationException("Invalid username and/or password.");
            }

            return new UserDTO(user);
        } finally {
            em.close();
        }
    }

    //UserResource
    public UserDTO getUserByUserName(String username) throws UserNotFoundException {
        EntityManager em = getEntityManager();

        try {
            User user = em.find(User.class, username);

            if (user == null) {
                throw new UserNotFoundException(username);
            }

            return new UserDTO(user);
        } finally {
            em.close();
        }
    }
    
    //MessageResource
    public User getUserByUsername(String username) throws UserNotFoundException{
        EntityManager em = getEntityManager();

        try {
            User user = em.find(User.class, username);

            if (user == null) {
                throw new UserNotFoundException(username);
            }

            return user;
        } finally {
            em.close();
        }
    }

    public List<UserDTO> getAllUsers() {
        EntityManager em = getEntityManager();

        List<User> users;
        List<UserDTO> userDTOs = new ArrayList<>();

        try {
            Query query = em.createNamedQuery("User.getAll");
            users = query.getResultList();

            users.forEach(user -> {
                userDTOs.add(new UserDTO(user));
            });

            return userDTOs;
        } finally {
            em.close();
        }
    }

}
