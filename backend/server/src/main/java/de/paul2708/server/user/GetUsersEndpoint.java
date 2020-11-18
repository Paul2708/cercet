package de.paul2708.server.user;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

public class GetUsersEndpoint implements Handler {

    private final UserRegistry userRegistry;

    public GetUsersEndpoint(UserRegistry userRegistry) {
        this.userRegistry = userRegistry;
    }

    @Override
    public void handle(@NotNull Context ctx) {
        ctx.json(userRegistry.findAllStudents());
    }
}