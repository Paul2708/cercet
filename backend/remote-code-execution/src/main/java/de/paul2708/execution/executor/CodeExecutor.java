package de.paul2708.execution.executor;

public abstract class CodeExecutor {

    private final String code;
    private OutputObserver observer;

    private boolean interrupted;

    public CodeExecutor(String code, OutputObserver observer) {
        this.code = code;
        this.observer = observer;

        this.interrupted = false;
    }

    public abstract void execute() throws Exception;

    public abstract void destroy();

    public abstract void clean();

    public void interrupt() {
        this.observer = (output, type) -> {

        };

        destroy();
    }

    public String getCode() {
        return code;
    }

    public OutputObserver getObserver() {
        return observer;
    }
}