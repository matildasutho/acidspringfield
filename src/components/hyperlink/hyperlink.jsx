import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

const options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      return (
        <a href={uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

const RichTextRenderer = ({ document }) => {
  return <>{documentToReactComponents(document, options)}</>;
};

export default RichTextRenderer;
