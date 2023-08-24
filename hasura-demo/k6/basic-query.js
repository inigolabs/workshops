import http from 'k6/http';

const query = `
query get_article_details {
    article {
      title
      content
      author {
        name
      }
      tags {
        tag {
          tag_value
        }
      }
    }
  }
`;

const headers = {
  'Content-Type': 'application/json',
};

export default function () {
  http.post(
    'http://localhost:8080/v1/graphql',
    JSON.stringify({ query }),
    { headers },
  );
}