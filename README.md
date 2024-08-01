# Express MongoDB Authentication Boilerplate

This is an Express.js and MongoDB-based boilerplate for implementing user authentication. The project includes features such as user registration, login, token management, and password reset. It also requires an `x-api-key` header for requests.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sargas-company/authentication-node
```

2. Install dependencies:

```bash
npm install
```

3. Copy the `.env.example` file and create a new `.env` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your environment variables, such as database connection string, JWT secrets, and the `x-api-key`.

5. Start the development server:

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`.

## API Usage

To access the API, you need to include the `x-api-key` header in your requests. You can find the key value in the `.env` file.

### Example API Request

```bash
curl -X POST -H "x-api-key: your-api-key" -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}' http://localhost:5000/auth/login
```

## Built With

- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token implementation for Node.js
- [bcrypt](https://www.npmjs.com/package/bcrypt) - A library for hashing passwords
- [Mailgun](https://www.mailgun.com/) - Email API service

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
