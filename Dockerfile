FROM eclipse-temurin:21-jre

WORKDIR /app

# Копируем готовую .jar, собранную после ./gradlew build
COPY build/libs/*-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
