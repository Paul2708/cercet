package de.paul2708.server.execution;

import de.paul2708.execution.executor.CodeExecutor;
import de.paul2708.execution.executor.java.JavaCodeExecutor;
import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.user.User;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;

public record ExecutionEndpoint(ExecutionRunner runner, Logger logger) implements Handler {

    @Override
    public void handle(@NotNull Context ctx) throws Exception {
        User user = ctx.attribute(DefaultAccessManager.USER_KEY);

        ExecutionRequest request = ctx.bodyValidator(ExecutionRequest.class).get();

        CodeExecutor executor = new JavaCodeExecutor(request.getCode(), new WebSocketOutputObserver(user.getSocket()));
        runner.run(executor);

        logger.info(String.format("%s is executing code.", user.getName()));

        ctx.status(201).result("Alles top");
    }
}
