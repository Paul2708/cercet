package de.paul2708.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import de.paul2708.execution.runner.ExecutionRunner;
import de.paul2708.server.config.Configuration;
import de.paul2708.server.curser.CursorMessageListener;
import de.paul2708.server.execution.ExecutionEndpoint;
import de.paul2708.server.gson.ExcludeStrategy;
import de.paul2708.server.gson.GsonJsonMapper;
import de.paul2708.server.heartbeat.HeartbeatBroadcast;
import de.paul2708.server.login.LoginEndpoint;
import de.paul2708.server.login.LoginMessageListener;
import de.paul2708.server.patch.CodeRequestMessageListener;
import de.paul2708.server.patch.PatchMessageListener;
import de.paul2708.server.security.DefaultAccessManager;
import de.paul2708.server.template.CreateTemplateEndpoint;
import de.paul2708.server.template.GetTemplateEndpoint;
import de.paul2708.server.template.Template;
import de.paul2708.server.user.GetUsersEndpoint;
import de.paul2708.server.user.UserRegistry;
import de.paul2708.server.user.UserRole;
import de.paul2708.server.ws.Broadcaster;
import de.paul2708.server.ws.event.CloseListener;
import de.paul2708.server.ws.event.ConnectListener;
import de.paul2708.server.ws.event.ErrorListener;
import de.paul2708.server.ws.event.EventListener;
import de.paul2708.server.ws.message.MessageListener;
import de.paul2708.server.ws.message.MessageProcessing;
import io.javalin.Javalin;
import io.javalin.core.JavalinConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.TimeUnit;

public final class JavalinServer {

    private final Javalin javalin;
    private JavalinConfig config;

    public JavalinServer() {
        this.javalin = Javalin.create(config -> {
            this.config = config;
        });
    }

    public void configureAndStart() {
        // Gson setup
        Gson gson = new GsonBuilder().setExclusionStrategies(new ExcludeStrategy()).create();
        config.jsonMapper(new GsonJsonMapper(gson));

        // Load configuration
        Configuration configuration = new Configuration();
        configuration.load();

        // Registry & stuff
        UserRegistry userRegistry = new UserRegistry();
        Broadcaster broadcaster = new Broadcaster(userRegistry);
        Template template = new Template("""
                                                 public class Main {
                                                     public static void main(String[] args) {
                                                         System.out.println("Hello World!");
                                                     }
                                                 }""");

        // Security
        config.accessManager(new DefaultAccessManager(userRegistry));

        // Mappings
        javalin.exception(Exception.class, (e, context) -> {
            context.result("invalid format du tröttel");
        });

        // REST endpoints
        Logger restLogger = LoggerFactory.getLogger("REST");

        javalin.post("/login", new LoginEndpoint(userRegistry, configuration.getTeacherMapping(), restLogger),
                     UserRole.ANYONE);
        javalin.post("/execution", new ExecutionEndpoint(new ExecutionRunner(), restLogger), UserRole.STUDENT);

        javalin.get("/template", new GetTemplateEndpoint(template), UserRole.STUDENT);
        javalin.post("/template", new CreateTemplateEndpoint(template), UserRole.TEACHER);

        javalin.get("/user", new GetUsersEndpoint(userRegistry), UserRole.TEACHER);

        // Websocket endpoints
        Logger logger = LoggerFactory.getLogger("WS-Listener");

        List<MessageListener> listeners =
                List.of(new LoginMessageListener(userRegistry, broadcaster, logger),
                        new PatchMessageListener(userRegistry, broadcaster), new CursorMessageListener(userRegistry),
                        new CodeRequestMessageListener(userRegistry));
        MessageProcessing messageProcessing = new MessageProcessing(listeners, logger);

        EventListener connectListener = new ConnectListener();
        EventListener closeListener = new CloseListener(userRegistry, broadcaster, logger);
        EventListener errorListener = new ErrorListener(userRegistry, logger);

        // TODO: Check if web socket sends header. If so, the login is no longer necessary.

        javalin.ws("/ws", ws -> {
            ws.onConnect(connectListener::handle);
            ws.onMessage(messageProcessing);
            ws.onClose(closeListener::handle);
            ws.onError(errorListener::handle);
        }, UserRole.ANYONE);

        // Run heartbeat broadcaster
        HeartbeatBroadcast heartbeatBroadcast = new HeartbeatBroadcast(broadcaster, TimeUnit.MINUTES, 1);
        heartbeatBroadcast.start();

        // Run instance
        javalin.start(42069);
    }
}
