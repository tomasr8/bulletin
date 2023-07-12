-- Bilingual Bulletin issues (essentially pre 2009)
CREATE TABLE bilingual_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    page int,
    content text,

    CONSTRAINT bilingual_documents_year_issues_unique UNIQUE (year, issues, page)
);

-- English Bulletin issues
CREATE TABLE english_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    page int,
    content text,

    CONSTRAINT english_documents_year_issues_unique UNIQUE (year, issues, page)
);

-- French Bulletin issues
CREATE TABLE french_documents (
    id SERIAL PRIMARY KEY,
    year text,
    issues text,
    page int,
    content text,

    CONSTRAINT french_documents_year_issues_unique UNIQUE (year, issues, page)
);

-- We distinguish the language to get a more accurate full text search for
-- issues which are written in a single language (only english or only french).

-- Helper function which combines english and french tsvectors
CREATE FUNCTION to_tsvector_multilang(text) RETURNS tsvector AS $$
SELECT to_tsvector('english', $1) || to_tsvector('french', $1)
$$ LANGUAGE sql IMMUTABLE;

-- Text search indexes
CREATE INDEX bilingual_documents_full_text_idx ON bilingual_documents USING gin(to_tsvector_multilang(content));
CREATE INDEX english_documents_full_text_idx ON english_documents USING GIN (to_tsvector('english', content));
CREATE INDEX french_documents_full_text_idx ON french_documents USING GIN (to_tsvector('french', content));

-- Normal indexes
CREATE INDEX bilingual_documents_year_issues_idx ON bilingual_documents (year, issues);
CREATE INDEX english_documents_year_issues_idx ON english_documents (year, issues);
CREATE INDEX french_documents_year_issues_idx ON french_documents (year, issues);

CREATE INDEX bilingual_documents_page_idx ON bilingual_documents (page);
CREATE INDEX english_documents_page_idx ON english_documents (page);
CREATE INDEX french_documents_page_idx ON french_documents (page);

-- This DB will never change so we can allocate some more memory and
-- properly analyze it to get better query plans.
ALTER DATABASE bulletin SET default_statistics_target = '10000';
VACUUM (FULL, ANALYZE);

-- CREATE INDEX bilingual_documents_full_text_english_idx ON bilingual_documents USING gin(to_tsvector('english', content));
-- CREATE INDEX bilingual_documents_full_text_french_idx ON bilingual_documents USING gin(to_tsvector('french', content));

