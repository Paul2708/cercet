package de.paul2708.server.template;

import io.javalin.http.Context;
import io.javalin.http.Handler;
import org.jetbrains.annotations.NotNull;

/**
 * Class description.
 *
 * @author Paul2708
 */
public class CreateTemplateEndpoint implements Handler {

    private Template template;

    public CreateTemplateEndpoint(Template template) {
        this.template = template;
    }

    @Override
    public void handle(@NotNull Context ctx) {
        TemplateRequest templateRequest = ctx.bodyValidator(TemplateRequest.class).get();

        template.setCode(templateRequest.getTemplate());

        ctx.result("alles geklappt");
    }
}
