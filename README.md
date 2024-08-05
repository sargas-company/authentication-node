# Express MongoDB Authentication Boilerplate

This boilerplate project provides a robust and scalable foundation for implementing user authentication using Express.js and MongoDB. It includes essential features such as user registration, login, token management, and password reset, with enhanced security measures requiring an `x-api-key` header for all API requests.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing.

### Prerequisites

Make sure you have the following software installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/sargas-company/authentication-node
    cd authentication-node
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**

    - Copy the example environment configuration file and rename it to `.env`:

        ```bash
        cp .env.example .env
        ```

    - Update the `.env` file with your environment-specific variables, such as the database connection string, JWT secrets, email service credentials, and the `x-api-key`.

4. **Start the development server:**

    ```bash
    npm run dev
    ```

   The server will be running at `http://localhost:5000`.

## API Usage

To access the API, include the `x-api-key` header in your requests. The key value is specified in your `.env` file.

### Example API Request

Here's how to make a login request using `curl`:

    ```bash
    curl -X POST \
         -H "x-api-key: your-api-key" \
         -H "Content-Type: application/json" \
         -d '{"email": "user@example.com", "password": "password123"}' \
         http://localhost:5000/auth/login
    ```

## Features

### User Registration

Allows users to register by providing a username, email, and password.

### User Login

Authenticates users and returns a JWT token for subsequent requests.

### Token Management

Handles JWT token issuance, verification, and refresh.

### Password Reset

Allows users to reset their passwords via email.

## Project Structure

The project is organized as follows:

    ```
    ├── doc
    │   └── authentication-node.postman_collection.json # Postman collection   
    ├── src
    │   ├── config       # Configuration files
    │   ├── constants    # Constants and enums
    │   ├── controllers  # Route controllers
    │   ├── helpers      # Helpers functions
    │   ├── middlewares  # Express middlewares
    │   ├── models       # Mongoose models
    │   ├── routes       # Express routes
    │   ├── services     # Business logic
    │   ├── validators   # Validation logc
    │   └── index.js       # Entry point of the application
    ├── test             # Test files
    ├── .env.example     # Example environment variables
    ├── .env.test        # Environment variables for testing
    ├── .eslintrc.js     # ESLint configuration
    ├── .prettierrc      # Prettier configuration
    ├── package.json     # NPM dependencies and scripts 
    └── README.md        # Project documentation
    ```

## Built With

- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling tool for Node.js
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT implementation for Node.js
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Library for hashing passwords
- [nodemailer](https://nodemailer.com/about/) - Module for sending emails
- [sinon](https://sinonjs.org/) - Standalone test spies, stubs, and mocks
- [chai](https://www.chaijs.com/) - Assertion library for Node.js and the browser
- [supertest](https://github.com/visionmedia/supertest) - HTTP assertions for testing

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.