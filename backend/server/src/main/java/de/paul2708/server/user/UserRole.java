package de.paul2708.server.user;

import io.javalin.core.security.Role;

import java.util.Set;

public enum UserRole implements Role {

    ANYONE(),
    STUDENT(ANYONE),
    TEACHER(STUDENT);

    private final UserRole[] inheritedRoles;

    UserRole(UserRole... inheritedRoles) {
        this.inheritedRoles = inheritedRoles;
    }

    public boolean isPermitted(Set<Role> permittedRoles) {
        if (inheritedRoles != null) {
            for (UserRole inheritedRole : inheritedRoles) {
                if (permittedRoles.contains(inheritedRole)) {
                    return true;
                }
            }
        }

        return permittedRoles.contains(this);
    }
}