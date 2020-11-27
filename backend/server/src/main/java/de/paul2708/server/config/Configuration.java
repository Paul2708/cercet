package de.paul2708.server.config;

import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class Configuration {

    private static final String PATH = "config.yaml";

    private Map<String, Object> root;

    public void load() {
        Yaml yaml = new Yaml();

        if (Files.notExists(Paths.get(PATH))) {
            System.out.println("Using default configuration");

            try (InputStream stream = getClass().getClassLoader().getResourceAsStream("config.yaml")) {
                this.root = yaml.load(stream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try (InputStream stream = new FileInputStream(new File(PATH))) {
                this.root = yaml.load(stream);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public Map<String, String> getTeacherMapping() {
        List<String> teachers = (List<String>) root.get("teachers");

        Map<String, String> mapping = new HashMap<>();

        for (String teacher : teachers) {
            String[] array = teacher.split(":");
            mapping.put(array[0], array[1]);
        }

        return mapping;
    }
}