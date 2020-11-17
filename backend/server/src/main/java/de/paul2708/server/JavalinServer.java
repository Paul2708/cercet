package de.paul2708.server;

import de.paul2708.execution.executor.java.JavaCodeExecutor;
import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.execution.ExecutionHandler;
import de.paul2708.server.login.LoginMessageListener;
import de.paul2708.server.login.StudentLoginHandler;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import de.paul2708.server.ws.MessageListener;
import de.paul2708.server.ws.MessageProcessing;
import io.javalin.Javalin;
import io.javalin.core.JavalinConfig;

import java.util.List;

import static io.javalin.core.security.SecurityUtil.roles;

public final class JavalinServer {

    private final Javalin javalin;

    private final JavalinConfig config;

    public JavalinServer() {
        this.javalin = Javalin.create();

        this.config = javalin.config;
    }

    public void configureAndStart() {
        UserRegistry userRegistry = new UserRegistry();

        // Security
        config.accessManager(new DefaultAccessManager(userRegistry));

        // Mappings
        javalin.exception(Exception.class, (e, context) -> {
            context.result("invalid format du tröttel");
        });

        // REST endpoints
        javalin.post("/login/student",
                new StudentLoginHandler(userRegistry),
                roles(UserRole.ANYONE));
        javalin.post("/execution",
                new ExecutionHandler(new ExecutionRunner(new JavaCodeExecutor())),
                roles(UserRole.STUDENT));

        // Websocket endpoints
        List<MessageListener> listeners = List.of(
                new LoginMessageListener(userRegistry)
        );
        MessageProcessing messageProcessing = new MessageProcessing(listeners);

        javalin.ws("/ws", ws -> {
            ws.onConnect(ctx -> {
                // Ignored.
                System.out.println("Connected");
            });
            ws.onMessage(messageProcessing);
            ws.onClose(ctx -> {
                System.out.println("Closed");
            });
            ws.onError(ctx -> {
                // TODO: Error, what to do now?
                System.out.println("Error!?");
            });
        }, roles(UserRole.ANYONE));

        // Run instance
        javalin.start(42069);
    }
}