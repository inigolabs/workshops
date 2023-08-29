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




