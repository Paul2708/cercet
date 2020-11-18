package de.paul2708.server.execution;

import de.paul2708.execution.executor.CodeExecutor;
import de.paul2708.execution.executor.java.JavaCodeExecutor;
import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.user.User;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

public final class ExecutionEndpoint implements Handler {

    private final ExecutionRunner runner;

    public ExecutionEndpoint(ExecutionRunner runner) {
        this.runner = runner;
    }

    @Override
    public void handle(@NotNull Context ctx) throws Exception {
        User user = ctx.attribute(DefaultAccessManager.USER_KEY);

        ExecutionRequest request = ctx.bodyValidator(ExecutionRequest.class).get();

        CodeExecutor executor = new JavaCodeExecutor(request.getCode(), new WebSocketOutputObserver(user.getSocket()));
        runner.run(executor);

        ctx.status(201).result("Alles top");
    }
}
