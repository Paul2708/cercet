package de.paul2708.server.execution;

import de.paul2708.execution.executor.OutputObserver;
import de.paul2708.execution.executor.OutputType;
import io.javalin.websocket.WsContext;

public final class WebSocketOutputObserver implements OutputObserver {

    private final WsContext socket;

    public WebSocketOutputObserver(WsContext socket) {
        this.socket = socket;
    }

    @Override
    public void observeOutput(String output, OutputType type) {
        CodeOutputMessage message = new CodeOutputMessage(output, type);

        socket.send(message.toJson().toString());
    }
}