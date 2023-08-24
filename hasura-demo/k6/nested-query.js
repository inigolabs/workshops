import http from 'k6/http';

const query = `
query get_author_articles_dos {
    author {
      name
      articles {
        title
        tags {
          tag {
            tag_value
          }
        }
        author {
          articles {
            title
            tags {
              tag {
                tag_value
              }
            }
            author {
              name
              articles {
                title
                tags {
                  tag {
                    tag_value
                  }
                }
                author {
                  name
                  articles {
                    title
                    tags {
                      tag {
                        tag_value
                      }
                    }
                    author {
                      name
                      articles {
                        title
                        tags {
                          tag {
                            tag_value
                          }
                        }
                        author {
                          name
                          articles {
                            title
                            tags {
                              tag {
                                tag_value
                              }
                            }
                            author {
                              name
                              articles {
                                title
                                tags {
                                  tag {
                                    tag_value
                                  }
                                }
                                author {
                                  name
                                  articles {
                                    title
                                    tags {
                                      tag {
                                        tag_value
                                      }
                                    }
                                    author {
                                      name
                                      articles {
                                        title
                                        tags {
                                          tag {
                                            tag_value
                                          }
                                        }
                                        author {
                                          name
                                          articles {
                                            title
                                            tags {
                                              tag {
                                                tag_value
                                              }
                                            }
                                            author {
                                              name
                                              articles {
                                                title
                                                tags {
                                                  tag {
                                                    tag_value
                                                  }
                                                }
                                                author {
                                                  name
                                                  articles {
                                                    title
                                                    tags {
                                                      tag {
                                                        tag_value
                                                      }
                                                    }
                                                    author {
                                                      name
                                                      articles {
                                                        title
                                                        tags {
                                                          tag {
                                                            tag_value
                                                          }
                                                        }
                                                        author {
                                                          name
                                                          articles {
                                                            title
                                                            tags {
                                                              tag {
                                                                tag_value
                                                              }
                                                            }
                                                            author {
                                                              name
                                                              articles {
                                                                title
                                                                tags {
                                                                  tag {
                                                                    tag_value
                                                                  }
                                                                }
                                                                author {
                                                                  name
                                                                  articles {
                                                                    title
                                                                    tags {
                                                                      tag {
                                                                        tag_value
                                                                      }
                                                                    }
                                                                    author {
                                                                      name
                                                                      articles {
                                                                        title
                                                                        tags {
                                                                          tag {
                                                                            tag_value
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
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


