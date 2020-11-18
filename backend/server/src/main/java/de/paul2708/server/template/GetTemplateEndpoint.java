package de.paul2708.server.template;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class GetTemplateEndpoint implements Handler {

    private final Template template;

    public GetTemplateEndpoint(Template template) {
        this.template = template;
    }

    @Override
    public void handle(@NotNull Context ctx) {
        TemplateResponse response = new TemplateResponse(template.getCode());

        ctx.json(response);
    }
}