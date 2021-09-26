package de.paul2708.server.gson;

import com.google.gson.Gson;
import io.javalin.plugin.json.JsonMapper;
import org.jetbrains.annotations.NotNull;

import java.io.InputStream;

/**
 * JsonMapper implementation for (de)serializing using gson.
 */
public class GsonJsonMapper implements JsonMapper {

    private final Gson gson;

    public GsonJsonMapper(Gson gson) {
        this.gson = gson;
    }

    @NotNull
    @Override
    public String toJsonString(@NotNull Object obj) {
        return gson.toJson(obj);
    }

    @NotNull
    @Override
    public <T> T fromJsonString(@NotNull String json, @NotNull Class<T> targetClass) {
        return gson.fromJson(json, targetClass);
    }

    @NotNull
    @Override
    public InputStream toJsonStream(@NotNull Object obj) {
        throw new UnsupportedOperationException("toJsonStream is not supported");
    }

    @NotNull
    @Override
    public <T> T fromJsonStream(@NotNull InputStream json, @NotNull Class<T> targetClass) {
        throw new UnsupportedOperationException("toJsonStream is not supported");
    }
}
