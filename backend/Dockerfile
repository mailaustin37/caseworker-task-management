FROM maven:3.9.12-eclipse-temurin-21-alpine AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY src src
RUN mvn -q clean package

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S hmcts && adduser -S hmcts -G hmcts
WORKDIR /app
COPY --from=build /workspace/target/caseworker-task-api-0.0.1-SNAPSHOT.jar app.jar
USER hmcts
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
