plugins {
    `cercet-module`
    application
}

dependencies {
    implementation("io.javalin:javalin:4.0.1")
    implementation(project(":cercet-backend-remote-code-execution"))
    implementation("com.google.code.gson:gson:2.8.8")
    implementation("org.yaml:snakeyaml:1.29")
}

description = "cercet-backend-server"

application {
    mainClass.set("de.paul2708.server.Main")
}
