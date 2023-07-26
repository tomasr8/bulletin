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