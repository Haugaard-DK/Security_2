package DTOs;

import entities.Message;
import entities.User;
import java.text.SimpleDateFormat;
import java.util.Objects;

public class MessageDTO {
    
    private String messageText;
    private String created;
    private UserDTO user;
    
    public MessageDTO(Message message) {
        this.messageText = message.getMessageText();
        
        SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z");
        created = dateFormatter.format(message.getCreated());
        
        this.user = new UserDTO(message.getUser());
    }

    public String getMessageText() {
        return messageText;
    }

    public String getCreated() {
        return created;
    }

    public UserDTO getUser() {
        return user;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 79 * hash + Objects.hashCode(this.messageText);
        hash = 79 * hash + Objects.hashCode(this.created);
        hash = 79 * hash + Objects.hashCode(this.user);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final MessageDTO other = (MessageDTO) obj;
        if (!Objects.equals(this.messageText, other.messageText)) {
            return false;
        }
        if (!Objects.equals(this.created, other.created)) {
            return false;
        }
        if (!Objects.equals(this.user, other.user)) {
            return false;
        }
        return true;
    }
    
    

}
