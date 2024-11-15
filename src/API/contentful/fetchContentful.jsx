const scrollingTextQuery = `
  query {
    componentScrollingTextCollection {
      items {
        entryTitle
        textContent {
          json
        }
      }
    }
  }
`;

const homePageLinksQuery = `
  query {
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
  }
`;

const projectQuery = `
  query {
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
        heroImagePosition
        projectSummary
        rightColumn {
          json
        }
        projectLinks {
          json
        }
        paragraph1
        mediaBlockCollection(limit: 20) {
          items {
            sys {
              id
            }
              __typename
            ... on ComponentImageBlockDouble {
              internalTitle
              imageBlockCollection(limit: 5) {
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
              imageAlignment
            }
              ... on ComponentProjectMediaGallery {
              internalTitle
              galleryContentCollection(limit: 6) {
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
              galleryWidth
              galleryAlignment
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
              imageWidth
              imageOrientation
              imageAlignment
            }
            ... on ComponentText {
              textContent {
                json
              }
              textWidth
              textAlignment
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
              reelFormat  
            }
            
          }

        }
      
        backgroundColour
        projectDate
      }
    }
  }
`;

const infoQuery = `
  query {
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
        ericaImage {
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

const fetchContentfulData = async (query) => {
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
};

export const fetchScrollingText = () => fetchContentfulData(scrollingTextQuery);
export const fetchHomePageLinks = () => fetchContentfulData(homePageLinksQuery);
export const fetchProjects = () => fetchContentfulData(projectQuery);
export const fetchInfo = () => fetchContentfulData(infoQuery);
