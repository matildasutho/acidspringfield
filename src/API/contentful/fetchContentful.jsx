import React from "react";

const query = `
  query {
  componentScrollingTextCollection {
    items {
      entryTitle
      textContent {
        json
      }
    }
  }
componentHomePageLinksCollection {
      items {
        sys {
          id
          publishedVersion
          publishedAt
          firstPublishedAt
        }
        internalTitle
        linksList {
          json
        }
      }
    }
    projectCollection {
      items {
        sys {
          id
          publishedVersion
          publishedAt
          firstPublishedAt
        }
        projectTitle
        heroImage {
          url
          title
          description
          contentType
          fileName
          size
          width
          height
        }
        projectSummary
        rightColumn {
          json
        }
        projectLinks {
          json
        }
        paragraph1
        imageBlock1Collection(limit: 2) {
          items {
            url
            title
            description
            contentType
            fileName
            size
            width
            height
          }
        }
        paragraph2
        imageBlock2Collection(limit: 2) {
          items {
            url
            title
            description
            contentType
            fileName
            size
            width
            height
          }
        }
        paragraph3
        media1 {
          url
          title
          description
          contentType
          fileName
          size
          width
          height
        }
        paragraph4
        mediaBlockCollection(limit: 5) {
          items {
            sys {
              id
            }
         
            ... on ComponentImageBlockDouble {
              internalTitle
              imageBlockCollection(limit: 2) {
                items {
                  title
                  description
                  contentType
                  fileName
                  size
                  url
                  width
                  height
                }
              }
              layout
            }
            ... on ComponentImageBlockSingle {
              internalTitle
              image {
                url
                title
                description
                contentType
                fileName
                size
                width
                height
              }
              layout
            }
            ... on ComponentText {
              textContent {
                json
              }
              layout
            }
            ... on ComponentVideoTextBlock {
              internalTitle
              video {
                url
                title
                description
                contentType
                fileName
                size
                width
                height
              }
              videoText {
                json
              }
              textPosition
            }
          }
        }
      }
    }
infoCollection {
      items {
        infoSummary
        paragraph1
          rightColumn {
          json
      }
      heroImage {
        title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        benImage {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        ericaImage
        {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
      }
    }
  }
`;

export async function fetchData() {
  const response = await fetch(
    "https://graphql.contentful.com/content/v1/spaces/pov2gvdkmhdq/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer _PGh_UkqVR6FR53ikwA2FPLpWIggek9ok0B-ODR5NR8",
      },
      body: JSON.stringify({ query }),
    }
  );

  const { data, errors } = await response.json();

  if (errors) {
    console.error(errors);
    throw new Error("Failed to fetch data");
  }

  return data;
}
