# Invojsik

A simple web application for generating invoices.

## Running the Application

1.  **Start the Backend:**
    ```bash
    ./gradlew bootRun
    ```
    The backend will be available at `http://localhost:8080`.

2.  **Start the Frontend:**
    Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
    Install dependencies:
    ```bash
    npm install
    ```
    Start the React application:
    ```bash
    npm start
    ```
    The frontend will be available at `http://localhost:3000`.

## Usage

After starting both parts of the application, open `http://localhost:3000` in your browser. You will be able to create and generate invoices.

## Building Docker Image

To build the Docker image for the application, navigate to the project root directory and run the following command:

```bash
./gradlew bootBuildImage
```

This command will build the Spring Boot application and then create a Docker image. The image name will be `invojsik:0.0.1-SNAPSHOT` (or whatever your `group` and `version` are in `build.gradle`).

To run the Docker image:

```bash
docker run --rm -p 8080:8080 invojsik:0.0.1-SNAPSHOT
```
