const query = `{
  projectCollection {
    items {
      projectTitle
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
      projectSummary
            rightColumn {
      json
      }
      paragraph1
      imageBlock1Collection {    
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
      paragraph2
      imageBlock2Collection {  
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
      paragraph3
      media1 {
        title
        description
        contentType
        fileName
        size
        url
        width
        height
      }
      paragraph4

    }
  }
infoCollection {
    items {
      infoSummary
      paragraph1
      image1 {
        title
        description
        contentType
        fileName
        size
        url
        width
        height
      }
      sideBar
    }
}
}`;

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
