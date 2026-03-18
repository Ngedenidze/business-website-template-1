import type { PortableTextBlock } from "@/sanity/types";

type BlogRichTextProps = {
  blocks: PortableTextBlock[];
};

function blockText(block: PortableTextBlock) {
  return Array.isArray(block.children)
    ? block.children.map((child) => child.text).join("")
    : "";
}

export function BlogRichText({ blocks }: BlogRichTextProps) {
  return (
    <div className="blog-rich-text">
      {blocks.map((block, index) => {
        const key = block._key || `block-${index}`;
        const text = blockText(block).trim();

        if (!text) {
          return null;
        }

        if (block.listItem === "bullet") {
          return (
            <ul key={key}>
              <li>{text}</li>
            </ul>
          );
        }

        if (block.listItem === "number") {
          return (
            <ol key={key}>
              <li>{text}</li>
            </ol>
          );
        }

        if (block.style === "h2") {
          return <h2 key={key}>{text}</h2>;
        }

        if (block.style === "h3") {
          return <h3 key={key}>{text}</h3>;
        }

        if (block.style === "blockquote") {
          return <blockquote key={key}>{text}</blockquote>;
        }

        return <p key={key}>{text}</p>;
      })}
    </div>
  );
}
