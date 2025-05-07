## Description

This application implements a hierarchical role-based permission management system that allows groups of users to access information based on their roles within the organisation. This system is designed with security and privacy by design while fostering collaboration across different levels of the organisational structure.
It demonstrates a strong understanding of:

# Hierarchical data representation

# Role-based access control (RBAC)

# Scalable and performant architecture

## Requirements
Docker Desktop installed and running
Postman for API testing (optional)

## Configurations & setup

You need to setup the postgres database on docker so that you do not have to install on the local machine and run docker desktop:
on terminal run: docker-compose up -d 

We use a guard to authenticate the user and also to check the roles. 

## Running the Application
Once the database is running:
Start your Node.js app (e.g yarn run start:dev)
Use Postman to test the API endpoints (the coillection provided on the project files: Role-Based-Permissions.postman_collection.json). You will need to import it. 
Start with login and supply the username and password. (If the user is created.). 

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test






