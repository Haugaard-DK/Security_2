package rest;

import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author Nicklas Nielsen
 */
@javax.ws.rs.ApplicationPath("/")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(cors.CorsFilter.class);
        resources.add(errorhandling.mappers.API_ExceptionMapper.class);
        resources.add(errorhandling.mappers.AuthenticationExceptionMapper.class);
        resources.add(errorhandling.mappers.GenericExceptionMapper.class);
        resources.add(errorhandling.mappers.NotAuthorizedExceptionMapper.class);
        resources.add(errorhandling.mappers.UserNotFoundExceptionMapper.class);
        resources.add(org.glassfish.jersey.server.wadl.internal.WadlResource.class);
        
        resources.add(rest.UserResource.class);
        resources.add(security.JWTAuthenticationFilter.class);
        resources.add(security.RolesAllowedFilter.class);

    }

}
