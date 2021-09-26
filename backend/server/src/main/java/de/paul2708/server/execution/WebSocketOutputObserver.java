package de.paul2708.server.execution;

import de.paul2708.execution.executor.OutputObserver;
import de.paul2708.execution.executor.OutputType;
import io.javalin.websocket.WsContext;

public record WebSocketOutputObserver(WsContext socket) implements OutputObserver {

    @Override
    public void observeOutput(String output, OutputType type) {
        CodeOutputMessage message = new CodeOutputMessage(output, type);

        socket.send(message.toJson().toString());
    }
}
