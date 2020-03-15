FROM maven:3.5-jdk-8 AS build
WORKDIR /apricot/backend
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ /apricot/backend/src
RUN mvn clean package

FROM openjdk:8-jdk-alpine
WORKDIR /app
COPY --from=build /apricot/backend/target/retailbackend-0.0.1-SNAPSHOT.jar /app/retailbackend-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar", "-Dspring.profiles.active=prod", "/app/retailbackend-0.0.1-SNAPSHOT.jar"]

#FROM openjdk:8-jdk-alpine
#ARG JAR_FILE=target/retailbackend-0.0.1-SNAPSHOT.jar
#COPY ${JAR_FILE} app.jar
#ENTRYPOINT ["java","-jar", "-Dspring.profiles.active=prod", "/app.jar"]