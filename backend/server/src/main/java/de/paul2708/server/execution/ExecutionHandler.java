package de.paul2708.server.execution;

import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.user.User;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

public final class ExecutionHandler implements Handler {

    private final ExecutionRunner runner;

    public ExecutionHandler(ExecutionRunner runner) {
        this.runner = runner;
    }

    @Override
    public void handle(@NotNull Context ctx) throws Exception {
        User user = ctx.attribute(DefaultAccessManager.USER_KEY);

        ExecutionRequest request = ctx.bodyValidator(ExecutionRequest.class).get();

        runner.run(request.getCode(), new WebSocketOutputObserver(user.getSocket()));

        ctx.status(201).result("Alles top");
    }
}
