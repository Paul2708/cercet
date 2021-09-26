FROM eclipse-temurin:17-alpine as builder

WORKDIR /app
COPY . /app
RUN ./gradlew installDist

FROM eclipse-temurin:17-alpine
WORKDIR /app
EXPOSE 42069
CMD ["/app/bin/cercet-backend-server"]
COPY --from=builder /app/server/build/install/cercet-backend-server /app/
