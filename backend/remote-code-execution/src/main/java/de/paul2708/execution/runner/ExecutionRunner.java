package de.paul2708.execution.runner;

import de.paul2708.execution.executor.CodeExecutor;
import de.paul2708.execution.executor.OutputObserver;
import de.paul2708.execution.executor.OutputType;
import de.paul2708.execution.executor.java.JavaCodeExecutor;

import java.io.IOException;
import java.util.concurrent.*;

public class ExecutionRunner {

    private final ExecutorService executorService;
    private final long timeout;
    private final TimeUnit timeoutUnit;

    public ExecutionRunner(ExecutorService executorService, long timeout, TimeUnit timeoutUnit) {
        this.executorService = executorService;
        this.timeout = timeout;
        this.timeoutUnit = timeoutUnit;
    }

    public ExecutionRunner() {
        this(Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors()),
                10, TimeUnit.SECONDS);
    }

    public void run(CodeExecutor codeExecutor) {
        Future<?> future = executorService.submit(() -> {
            try {
                codeExecutor.execute();
                codeExecutor.clean();
            } catch (Exception e) {
                codeExecutor.getObserver().observeOutput("Failed to execute code: " + e.getMessage(),
                        OutputType.INTERNAL_ERROR);
                e.printStackTrace();
            }
        });

        executorService.submit(() -> {
            try {
                future.get(timeout, timeoutUnit);
            } catch (TimeoutException e) {
                codeExecutor.getObserver().observeOutput("Failed to await execution: It took to long!", OutputType.INTERNAL_ERROR);
                future.cancel(true);
                codeExecutor.interrupt();
            } catch (InterruptedException | ExecutionException e) {
                codeExecutor.getObserver().observeOutput("Failed to await execution: " + e.getMessage(), OutputType.INTERNAL_ERROR);
                e.printStackTrace();
            }
        });
    }

    public void shutdown() {
        executorService.shutdown();

        System.out.println("shutdown");
    }

    public static void main(String[] args) {
        String code = "public class Main { public static void main(String[] args) {while(true){}}}";
        CodeExecutor codeExecutor = new JavaCodeExecutor(code, (output, type) -> {
            System.out.println("[" + type + "]" + output);
        });
        ExecutionRunner runner = new ExecutionRunner();

        runner.run(codeExecutor);

        runner.shutdown();
    }
}