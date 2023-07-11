CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    content text
);

CREATE INDEX documents_idx ON documents USING GIN (to_tsvector('english', content));