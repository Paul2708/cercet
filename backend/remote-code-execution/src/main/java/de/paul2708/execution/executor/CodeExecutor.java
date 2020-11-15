package de.paul2708.execution.executor;

import java.io.IOException;

@FunctionalInterface
public interface CodeExecutor {

    void execute(String code, OutputObserver observer) throws IOException;
}