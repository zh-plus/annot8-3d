# Backend Installation Guide

This guide will help you set up the backend server for the project. Please follow the steps below to ensure all dependencies are installed correctly and the server runs smoothly.

## Prerequisites

- Ensure you have **conda** installed. You can download it from [Conda's website](https://docs.conda.io/en/latest/miniconda.html).
- **Python** version 3.8 or above is recommended for compatibility.

## Step 1: Set Up Conda Environment

1. Open a terminal and create a new conda environment:

    ```sh
    conda create -n 3d-annot-server python=3.8
    ```

2. Activate the newly created environment:

    ```sh
    conda activate 3d-annot-server
    ```

## Step 2: Install Dependencies

Navigate to the `src/backend/service` folder where the backend source code is located:

```sh
cd src/backend/service
```

Use **pip** to install the required dependencies from `requirements.txt`:

```sh
pip install -r requirements.txt
```

Additionally, install FastAPI with all standard dependencies to ensure everything works correctly:
```sh
pip install "fastapi[standard]"
```
You can refer to [FastAPI](https://github.com/fastapi/fastapi) for more details on using their CLI tools
### Note:
- If there are any platform-specific dependencies, additional installation instructions might be required. For example, `uvicorn` might need compilation tools, so ensure you have **build-essential** (Linux) or **Xcode Command Line Tools** (macOS) installed.

## Step 3: Run the Backend Server

After installing the dependencies, you can start the FastAPI server using **uvicorn**:

```sh
PYTHONPATH=src uvicorn openapi_server.main:app --host 127.0.0.1 --port 8080
```

If you prefer **FastAPI CLI**, you can start the server with:
```sh
PYTHONPATH=src fastapi dev src/openapi_server/main.py
```

- **`PYTHONPATH=src`**: This tells Python to include the `src` directory when searching for imports.
- **`--host 127.0.0.1`**: Makes the server accessible from any IP address on the network.
- **`--port 8080`**: Specifies the port number to access the server.

## Step 4: Testing the Server

You can test the server by navigating to `http://localhost:8080/docs` in your web browser. This will bring up the automatically generated Swagger UI, which provides a user-friendly interface to interact with all the available API endpoints.

Alternatively, use **tools like Postman**, **Thunder Client** (VS Code extension), or **cURL** to send requests to the server.

## Troubleshooting

- **Missing Dependencies**: If you encounter errors about missing libraries, check `requirements.txt` to ensure everything is installed.
- **Port Already in Use**: If port **8080** is occupied, change to an available port using the `--port` option.





