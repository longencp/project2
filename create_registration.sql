-- Remove any existing database and user.
DROP DATABASE IF EXISTS registration;
DROP USER IF EXISTS registration_user@localhost;

-- Create Unforget database and user. Ensure Unicode is fully supported.
CREATE DATABASE registration CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER registration_user@localhost IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON registration.* TO registration_user@localhost;
