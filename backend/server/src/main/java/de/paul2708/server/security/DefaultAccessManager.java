package de.paul2708.server.security;

import de.paul2708.server.user.User;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import io.javalin.core.security.AccessManager;
import io.javalin.core.security.RouteRole;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public final class DefaultAccessManager implements AccessManager {

    public static final String UID_HEADER = "X-UID";

    public static final String USER_KEY = "user";

    private final UserRegistry userRegistry;

    public DefaultAccessManager(UserRegistry userRegistry) {
        this.userRegistry = userRegistry;
    }

    @Override
    public void manage(@NotNull Handler handler, @NotNull Context ctx, @NotNull Set<RouteRole> permittedRoles) throws Exception {
        String header = ctx.header(UID_HEADER);
        Optional<UUID> optUUID = parseUUID(header);

        if (header == null || optUUID.isEmpty()) {
            denyOrAccept(handler, ctx, permittedRoles, UserRole.ANYONE);
        } else {
            Optional<User> optUser = userRegistry.findUser(optUUID.get());
            if (optUser.isEmpty()) {
                denyOrAccept(handler, ctx, permittedRoles, UserRole.ANYONE);
            } else {
                User user = optUser.get();

                ctx.attribute("user", user);
                denyOrAccept(handler, ctx, permittedRoles, user.getRole());
            }
        }
    }

    private void denyOrAccept(Handler handler, Context ctx, Set<RouteRole> permittedRoles, UserRole role) throws Exception {
        if (role.isPermitted(permittedRoles)) {
            handler.handle(ctx);
        } else {
            ctx.status(401).result("Unauthorized");
        }
    }

    private Optional<UUID> parseUUID(String input) {
        if (input == null) {
            return Optional.empty();
        }

        try {
            return Optional.of(UUID.fromString(input));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
