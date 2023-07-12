CREATE TABLE bilingual_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    content text,

    CONSTRAINT bilingual_documents_year_issues_unique UNIQUE (year, issues)
);

CREATE TABLE english_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    content text,

    CONSTRAINT english_documents_year_issues_unique UNIQUE (year, issues)
);

CREATE TABLE french_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    content text,

    CONSTRAINT french_documents_year_issues_unique UNIQUE (year, issues)
);

CREATE FUNCTION to_tsvector_multilang(text) RETURNS tsvector AS $$
SELECT to_tsvector('english', $1) || to_tsvector('french', $1)
$$ LANGUAGE sql IMMUTABLE;

CREATE INDEX bilingual_documents_full_text_idx ON bilingual_documents USING gin(to_tsvector_multilang(content));
CREATE INDEX english_documents_full_text_idx ON english_documents USING GIN (to_tsvector('english', content));
CREATE INDEX french_documents_full_text_idx ON french_documents USING GIN (to_tsvector('french', content));

CREATE INDEX bilingual_documents_full_text_english_idx ON bilingual_documents USING gin(to_tsvector('english', content));
CREATE INDEX bilingual_documents_full_text_french_idx ON bilingual_documents USING gin(to_tsvector('french', content));

