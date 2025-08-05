# Invojsik

Invoice generator for Slovakia.

## Сборка проекта

Проект состоит из двух основных частей:

*   **Бэкенд:** Spring Boot приложение, которое предоставляет REST API.
*   **Фронтенд:** Одностраничное приложение (SPA), написанное на React.

### Как это работает

При сборке проекта с помощью Gradle, происходит следующее:

1.  **Сборка фронтенда:** Gradle выполняет команды `npm install` и `npm run build` в директории `frontend`. Это создает оптимизированную для продакшена сборку React-приложения в папке `frontend/build`.
2.  **Копирование файлов:** Содержимое папки `frontend/build` копируется в `build/resources/main/static`.
3.  **Сборка JAR:** Spring Boot приложение собирается в один исполняемый JAR-файл, который включает в себя все статические файлы фронтенда.

Таким образом, для развертывания приложения достаточно одного JAR-файла.

### Полезные ссылки

*   [Spring Boot](https://spring.io/projects/spring-boot)
*   [React](https://react.dev/)
*   [Gradle](https://gradle.org/)
*   [Liquibase](https://www.liquibase.org/)
