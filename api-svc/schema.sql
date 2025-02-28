-- Hero Table
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    class VARCHAR(255) NOT NULL
);
