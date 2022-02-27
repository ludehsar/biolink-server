# Stashee - Backend

This is the backend project for the Stashee project.

## Requirements

For development, you will need
  - Node.js
  - Yarn
  - Postgresql

Recommended, but currently not necessary,
  - Redis

## Install

    $ git clone https://github.com/ludehsar/biolink-server.git
    $ cd biolink-server
    $ yarn

## Configure app

In order to configure this app after installing the npm packages, you need to:
  - Copy the content of .env.example, create a new file named .env, and then paste them in them
  - Change the value of .env file according to the requirements
  - Create a new database in postgresql and fill in the credentials in the .env file
  - For filling the API keys, go to the respective websites and get api keys from those respective web applications, and then fill them in the .env file
  - After running the `git pull` command everytime, it is better to run the following code to update the database:
  
        $ yarn typeorm migration:run

## Running the project

The project has been built using TypeScript. So first we need to compile the code into JavaScript. To compile the codes, open the terminal and write:

    $ yarn watch

While this is running in a terminal, open another terminal and paste the below code to run the project

    $ yarn dev

## Simple build for production

To compile and run the codes in production mode, open the terminal and write:

    $ yarn build
    $ yarn start

## Finding bugs

If you find any bugs, please feel free to use the issues tab in GitHub to give the details of the bug. You can also request new features using the issues tab. By using the issues tab, it will be easier for me to fix the issues.

## Contribute

Currently no contribution in this project is encouraged.
