package de.paul2708.server.execution;

import com.google.gson.JsonObject;
import de.paul2708.execution.executor.OutputType;

public final class CodeOutputMessage {

    private final String output;
    private final OutputType type;

    public CodeOutputMessage(String output, OutputType type) {
        this.output = output;
        this.type = type;
    }

    public JsonObject toJson() {
        JsonObject object = new JsonObject();

        object.addProperty("output", output);
        object.addProperty("type", type.name());

        return object;
    }

    public String getOutput() {
        return output;
    }

    public OutputType getType() {
        return type;
    }
}
