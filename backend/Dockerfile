# Use an official JDK image as build environment
FROM gradle:8.5.0-jdk17-alpine AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

# Use a smaller JRE for runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]