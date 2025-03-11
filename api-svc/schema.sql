-- Hero Table
CREATE TABLE heroes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL,
    class VARCHAR(255) NOT NULL
);

-- Equipment Table
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    minLevel INTEGER NOT NULL,
    hero_id INTEGER REFERENCES heroes(id)
);
