package de.paul2708.server;

import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.execution.ExecutionEndpoint;
import de.paul2708.server.login.LoginMessageListener;
import de.paul2708.server.login.LoginEndpoint;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.template.CreateTemplateEndpoint;
import de.paul2708.server.template.GetTemplateEndpoint;
import de.paul2708.server.template.Template;
import de.paul2708.server.user.GetUsersEndpoint;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import de.paul2708.server.ws.message.MessageListener;
import de.paul2708.server.ws.message.MessageProcessing;
import de.paul2708.server.ws.event.CloseListener;
import de.paul2708.server.ws.event.ConnectListener;
import de.paul2708.server.ws.event.ErrorListener;
import de.paul2708.server.ws.event.EventListener;
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
        Template template = new Template("public class Main {\n  " +
                "public static void main(String[] args) {\n    " +
                "System.out.println(\"Hello World!\");\n  }\n}");

        // Security
        config.accessManager(new DefaultAccessManager(userRegistry));

        // Mappings
        javalin.exception(Exception.class, (e, context) -> {
            context.result("invalid format du tröttel");
        });

        // REST endpoints
        javalin.post("/login",
                new LoginEndpoint(userRegistry),
                roles(UserRole.ANYONE));
        javalin.post("/execution",
                new ExecutionEndpoint(new ExecutionRunner()),
                roles(UserRole.STUDENT));

        javalin.get("/template",
                new GetTemplateEndpoint(template),
                roles(UserRole.STUDENT));
        javalin.post("/template",
                new CreateTemplateEndpoint(template),
                roles(UserRole.TEACHER));

        javalin.get("/user",
                new GetUsersEndpoint(userRegistry),
                roles(UserRole.TEACHER));

        // Websocket endpoints
        List<MessageListener> listeners = List.of(
                new LoginMessageListener(userRegistry)
        );
        MessageProcessing messageProcessing = new MessageProcessing(listeners);

        EventListener connectListener = new ConnectListener();
        EventListener closeListener = new CloseListener(userRegistry);
        EventListener errorListener = new ErrorListener();

        // TODO: Check if web socket sends header. If so, the login is no longer necessary.

        javalin.ws("/ws", ws -> {
            ws.onConnect(connectListener::handle);
            ws.onMessage(messageProcessing);
            ws.onClose(closeListener::handle);
            ws.onError(errorListener::handle);
        }, roles(UserRole.ANYONE));

        // Run instance
        javalin.start(42069);
    }
}