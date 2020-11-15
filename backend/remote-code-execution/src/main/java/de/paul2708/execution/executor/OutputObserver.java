package de.paul2708.execution.executor;

@FunctionalInterface
public interface OutputObserver {

    void observeOutput(String output, OutputType type);
}
