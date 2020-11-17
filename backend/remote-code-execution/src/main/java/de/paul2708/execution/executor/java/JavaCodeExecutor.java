package de.paul2708.execution.executor.java;

import de.paul2708.execution.executor.CodeExecutor;
import de.paul2708.execution.executor.OutputObserver;
import de.paul2708.execution.executor.OutputType;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.Scanner;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.stream.Stream;

public final class JavaCodeExecutor implements CodeExecutor {

    private static final String DIR_PATH = "./code/";
    private static final String MAIN_CLASS = "Main";

    private final ExecutorService service;

    public JavaCodeExecutor(ExecutorService service) {
        this.service = service;
    }

    public JavaCodeExecutor() {
        this(Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors()));
    }

    @Override
    public void execute(String code, OutputObserver observer) throws IOException {
        UUID identifier = UUID.randomUUID();

        // Prepare directory and files
        Path directory = Files.createDirectories(Paths.get(DIR_PATH + "/" + identifier + "/"));

        Path codeFile = Files.createFile(Paths.get(String.format("%s%s/%s.java", DIR_PATH, identifier, MAIN_CLASS)));
        Files.write(codeFile, code.getBytes(StandardCharsets.UTF_8));

        // Compile
        Process compileProcess = new ProcessBuilder("javac", String.format("%s.java", MAIN_CLASS))
                .directory(directory.toFile())
                .start();

        inheritIO(compileProcess.getErrorStream(), line -> observer.observeOutput(line, OutputType.ERROR));

        try {
            compileProcess.waitFor();
        } catch (InterruptedException e) {
            // Ignored, handled in ExecutionRunner
        }

        // Run
        Process runProcess = new ProcessBuilder("java", MAIN_CLASS)
                .directory(directory.toFile())
                .start();

        inheritIO(runProcess.getErrorStream(), line -> observer.observeOutput(line, OutputType.ERROR));
        inheritIO(runProcess.getInputStream(), line -> observer.observeOutput(line, OutputType.NORMAL));

        try {
            runProcess.waitFor();
        } catch (InterruptedException e) {
            // Ignored, handled in ExecutionRunner
        }

        // Delete directory
        try (Stream<Path> walk = Files.walk(directory)) {
            walk.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        }
    }

    private void inheritIO(InputStream src, Consumer<String> consumer) {
        service.submit(() -> {
            try (Scanner scanner = new Scanner(src)) {
                while (scanner.hasNextLine()) {
                    consumer.accept(scanner.nextLine());
                }
            }
        });
    }
}