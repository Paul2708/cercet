package de.paul2708.server.login;

public class LoginRequest {

    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "StudentInformation{" +
                "name='" + name + '\'' +
                '}';
    }
}
