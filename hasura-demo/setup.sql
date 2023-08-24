CREATE TABLE author (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE article (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  CONSTRAINT fk_author FOREIGN KEY(author_id) REFERENCES author(id)
);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  tag_value TEXT
);

CREATE TABLE article_tag (
  article_id INT,
  tag_id INT,
  PRIMARY KEY (article_id, tag_id),
  CONSTRAINT fk_article FOREIGN KEY(article_id) REFERENCES article(id),
  CONSTRAINT fk_tag FOREIGN KEY(tag_id) REFERENCES tag(id)
);

CREATE VIEW article_author_tag AS 
  SELECT 
  art.id as article_id,
  art.title,
  art.content,
  auth.id as author_id,
  auth.name,
  array(
    SELECT tag.tag_value
    FROM tag 
    JOIN article_tag art_tag ON art_tag.article_id = art.id
    WHERE art_tag.tag_id = tag.id
   ) AS tag_values
  FROM article art 
  JOIN author auth ON auth.id = art.author_id
