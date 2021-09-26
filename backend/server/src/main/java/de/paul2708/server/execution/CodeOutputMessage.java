package de.paul2708.server.execution;

import com.google.gson.JsonObject;
import de.paul2708.execution.executor.OutputType;

public record CodeOutputMessage(String output, OutputType type) {

    public JsonObject toJson() {
        JsonObject object = new JsonObject();

        object.addProperty("output", output);
        object.addProperty("type", type.name());

        return object;
    }
}
