package de.paul2708.execution.runner;

import de.paul2708.execution.executor.CodeExecutor;
import de.paul2708.execution.executor.OutputObserver;
import de.paul2708.execution.executor.OutputType;
import de.paul2708.execution.executor.java.JavaCodeExecutor;

import java.io.IOException;
import java.util.concurrent.*;

public class ExecutionRunner {

    private final CodeExecutor codeExecutor;
    private final ExecutorService executorService;
    private final long timeout;
    private final TimeUnit timeoutUnit;

    public ExecutionRunner(CodeExecutor codeExecutor, ExecutorService executorService, long timeout, TimeUnit timeoutUnit) {
        this.codeExecutor = codeExecutor;
        this.executorService = executorService;
        this.timeout = timeout;
        this.timeoutUnit = timeoutUnit;
    }

    public ExecutionRunner(CodeExecutor codeExecutor) {
        this(codeExecutor, Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors()),
                30, TimeUnit.SECONDS);
    }

    public void run(String code, OutputObserver outputObserver) {
        Future<?> future = executorService.submit(() -> {
            try {
                codeExecutor.execute(code, outputObserver);
            } catch (IOException e) {
                outputObserver.observeOutput("Failed to execute code: " + e.getMessage(), OutputType.INTERNAL_ERROR);
                e.printStackTrace();
            }
        });

        try {
            future.get(timeout, timeoutUnit);
        } catch (TimeoutException e) {
            future.cancel(true);
            outputObserver.observeOutput("Failed to await execution: It took to long!", OutputType.INTERNAL_ERROR);
        } catch (InterruptedException | ExecutionException e) {
            outputObserver.observeOutput("Failed to await execution: " + e.getMessage(), OutputType.INTERNAL_ERROR);
            e.printStackTrace();
        }
    }

    public void shutdown() {
        executorService.shutdown();
    }

    public static void main(String[] args) {
        ExecutionRunner runner = new ExecutionRunner(new JavaCodeExecutor());
        // System.out.println("hey");int a = 1 / 0;
        runner.run("public class Main {public static void main(String[] args){System.out.println(\"hey\");int a = 1 / 0;}}",
                (output, type) -> System.out.println("Received: " + output));
        runner.shutdown();
    }
}