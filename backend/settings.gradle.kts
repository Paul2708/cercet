rootProject.name = "cercet-backend"
include(":cercet-backend-server")
include(":cercet-backend-remote-code-execution")
project(":cercet-backend-server").projectDir = file("server")
project(":cercet-backend-remote-code-execution").projectDir = file("remote-code-execution")
