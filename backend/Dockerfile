FROM adoptopenjdk/openjdk11:alpine as builder

WORKDIR /app
COPY . /app
RUN chmod a+x ./mvnw && ./mvnw clean install

FROM adoptopenjdk/openjdk11:alpine-jre
WORKDIR /app
EXPOSE 42069
CMD ["java", "-jar", "app.jar"]
COPY --from=builder /app/server/target/*.jar /app/app.jar
