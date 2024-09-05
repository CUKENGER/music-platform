# Client-Server Application with React and NestJS

Welcome to the Client-Server Application built with React and NestJS! This guide will help you get started with setting up and running the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- [PostgreSQL](https://www.postgresql.org/download/)

## Setup Instructions

Follow these steps to set up the project:

### 1. Install PostgreSQL

Ensure PostgreSQL is installed on your system. 

### 2. Restore the Database

Open your terminal or command prompt and navigate to the PostgreSQL bin directory:

```bash
cd "C:\Program Files\PostgreSQL\16\bin"
```

Restore the database using the following command:
```bash
.\pg_restore -U postgres -W -d postgres -v "way_to_your_folder\music-platform_React\server\database_dump.sql"
```

### 3. Navigate to the Project Directory
Change to the project directory:
```bash
cd path\to\your\project
```

### 4. Create and Configure the .env File
Based on the example.env file provided in the project, create a new .env file in the root directory and enter your configuration details.

### 5. Install Dependencies
Install the necessary project dependencies using Yarn or npm:

```bash
yarn install
```
or

```bash
npm install
```

### 6. Run Database Migrations
Apply database migrations with Prisma:

```bash
npx prisma migrate dev --name init
```

### 7. Start the Server
Launch the server using Yarn or npm:

``` bash
yarn start:dev
```
or

```bash
npm start:dev
```

### 8. Start the Client
Navigate to the client directory and start the client application:

``` bash
cd client
```
```bash
yarn dev
```

or

```bash
npm start dev
```

### Contributing
We welcome contributions to the project! To contribute:

Fork the repository.
Create a new branch.
Make your changes and commit them.
Submit a pull request.
### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Contact
For any questions or support, please reach out to us at andreychuvashov2015@gmail.com.