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