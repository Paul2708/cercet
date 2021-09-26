package de.paul2708.server.template;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

/**
 * Class description.
 *
 * @author Paul2708
 */
public record GetTemplateEndpoint(Template template) implements Handler {

    @Override
    public void handle(@NotNull Context ctx) {
        TemplateResponse response = new TemplateResponse(template.getCode());

        ctx.json(response);
    }
}
