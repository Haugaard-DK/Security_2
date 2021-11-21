package entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.mindrot.jbcrypt.BCrypt;

@Entity
@Table(name = "USERS")
@NamedQueries({
    @NamedQuery(name = "User.getAll", query = "SELECT u FROM User u"),
    @NamedQuery(name = "User.deleteAllRows", query = "DELETE FROM User")})
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "USERNAME", length = 25)
    private String userName;

    @Basic(optional = false)
    @NotNull
    @Column(name = "CREATED")
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "PASSWORD")
    private String password;

    @ManyToMany
    @JoinTable(name = "LK_USERS_ROLES", joinColumns = {
        @JoinColumn(name = "USER", referencedColumnName = "USERNAME")}, inverseJoinColumns = {
        @JoinColumn(name = "ROLE", referencedColumnName = "ROLE_NAME")})
    private List<Role> roles;
    
    @OneToMany(mappedBy = "user")
    private List<Message> messages;

    public User(String username, String password, List<Role> roles) {
        this.userName = username;
        this.roles = new ArrayList<>();
        this.messages = new ArrayList<>();
        this.password = getHashWithSalt(password);
        created = new Date();

        roles.forEach((Role role) -> {
            addRole(role);
        });
    }

    public User() {
        this.roles = new ArrayList<>();
        this.messages = new ArrayList<>();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Date getCreated() {
        return created;
    }

    public boolean verifyPassword(String password) {
        return BCrypt.checkpw(password, this.password);
    }

    public void setPassword(String password) {
        this.password = getHashWithSalt(password);
    }

    private String getHashWithSalt(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt(4));
    }

    public List<Role> getRoles() {
        return roles;
    }
    
    public void addRole(Role role) {
        if (!roles.contains(role)) {
            roles.add(role);
            role.getUserList().add(this);
        }
    }

    public void removeRole(Role role) {
        if (roles.contains(role)) {
            roles.remove(role);
            role.getUserList().remove(this);
        }
    }
    
    public List<Message> getMessages() {
        return messages;
    }
    
    public void addMessage(Message message) {
        messages.add(message);
    }
    
    public void removeMessage(Message message) {
        if (messages.contains(message)) {
            messages.remove(message);
        }
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 31 * hash + Objects.hashCode(this.userName);
        hash = 31 * hash + Objects.hashCode(this.created);
        hash = 31 * hash + Objects.hashCode(this.password);
        hash = 31 * hash + Objects.hashCode(this.roles);
        hash = 31 * hash + Objects.hashCode(this.messages);
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
        final User other = (User) obj;
        if (!Objects.equals(this.userName, other.userName)) {
            return false;
        }
        if (!Objects.equals(this.password, other.password)) {
            return false;
        }
        if (!Objects.equals(this.created, other.created)) {
            return false;
        }
        if (!Objects.equals(this.roles, other.roles)) {
            return false;
        }
        if (!Objects.equals(this.messages, other.messages)) {
            return false;
        }
        return true;
    }

    

}
