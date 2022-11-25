CREATE DATABASE cuentas

CREATE TABLE users (
id VARCHAR(255) COLLATE latin1_swedish_ci,
PRIMARY KEY (id),
username VARCHAR(255) COLLATE latin1_swedish_ci,
password VARCHAR(255) COLLATE latin1_swedish_ci,
registered DATETIME,
last_login DATETIME
);