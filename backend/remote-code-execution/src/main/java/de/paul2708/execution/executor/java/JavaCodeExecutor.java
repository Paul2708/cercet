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

public final class JavaCodeExecutor extends CodeExecutor {

    private static final String DIR_PATH = "./code/";
    private static final String MAIN_CLASS = "Main";

    private static final int MAX_OUTPUTS = 1000;

    private final ExecutorService ioService;

    private Process process;

    private final UUID identifier;
    private Path directory;

    private int outputs;

    public JavaCodeExecutor(String code, OutputObserver observer) {
        super(code, observer);

        this.ioService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

        this.identifier = UUID.randomUUID();

        this.outputs = 0;
    }

    @Override
    public void execute() throws Exception {
        // Prepare directory and files
        this.directory = Files.createDirectories(Paths.get(DIR_PATH + "/" + identifier + "/"));

        Path codeFile = Files.createFile(Paths.get(String.format("%s%s/%s.java", DIR_PATH, identifier, MAIN_CLASS)));
        Files.writeString(codeFile, getCode());

        // Compile
        getObserver().observeOutput("Compiling...", OutputType.INFO);

        this.process = new ProcessBuilder("javac", String.format("%s.java", MAIN_CLASS))
                .directory(directory.toFile())
                .start();

        inheritIO(process.getErrorStream(), line -> getObserver().observeOutput(line, OutputType.ERROR));

        try {
            int exitStatus = process.waitFor();

            if (exitStatus != 0) {
                return;
            }
        } catch (InterruptedException e) {
            // Ignored, handled in ExecutionRunner
        }

        getObserver().observeOutput("Compiled.", OutputType.INFO);
        getObserver().observeOutput("Executing...", OutputType.INFO);

        // Run
        this.process = new ProcessBuilder("java", MAIN_CLASS)
                .directory(directory.toFile())
                .start();

        inheritIO(process.getErrorStream(), line -> getObserver().observeOutput(line, OutputType.ERROR));
        inheritIO(process.getInputStream(), line -> getObserver().observeOutput(line, OutputType.NORMAL));

        try {
            process.waitFor();
        } catch (InterruptedException e) {
            // Ignored, handled in ExecutionRunner
        }
    }

    @Override
    public void destroy() {
        process.destroy();
    }

    @Override
    public void clean() {
        try (Stream<Path> walk = Files.walk(directory)) {
            walk.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException e) {
            e.printStackTrace();
        }

        ioService.shutdownNow();
    }

    private void inheritIO(InputStream src, Consumer<String> consumer) {
        ioService.submit(() -> {
            try (Scanner scanner = new Scanner(src)) {
                while (scanner.hasNextLine()) {
                    if (outputs > MAX_OUTPUTS) {
                        getObserver().observeOutput("You reached the maximal amount of outputs.", OutputType.ERROR);
                        break;
                    }
                    
                    consumer.accept(scanner.nextLine());
                    outputs++;
                }
            }
        });
    }
}
