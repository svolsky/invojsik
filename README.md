# Invojsik

A simple web application for generating invoices. 
To generate invoice go to [invojsik.sk](https://invojsik.sk) it's free (and open source)

## How to run from docker image

It's possible to run app locally in docker. see details on dockerhub: https://hub.docker.com/r/svolskiy/invojsik


## How to build and from code

Requirements:
- jdk 21
- node v16.20.1

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

### Usage

After starting both parts of the application, open `http://localhost:3000` in your browser. You will be able to create and generate invoices.

### Building Docker Image

To build the Docker image for the application, navigate to the project root directory and run the following command:

```bash
docker compose build invojsik
```

This command will create a Docker image. The image name will be `invojsik:latest`.

To run the Docker image:

```bash
docker compose up invojsik
```

## Implementation details

To properly display symbols like Č, Š in pdf we must use fonts witch supports this. 
For example [DejaVuSans](https://dejavu-fonts.github.io/)
