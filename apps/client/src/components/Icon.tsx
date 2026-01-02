import React from "react";

type Props = {
  src: string;
  className?: string;
  strokeWidth?: number | string;
  ariaHidden?: boolean;
};

const Icon: React.FC<Props> = ({
  src,
  className = "",
  strokeWidth,
  ariaHidden = true,
}) => {
  let content = src;

  // 1. Remove all stroke-width, stroke, and fill attributes from child elements
  content = content.replace(/<svg([\s\S]*?)>([\s\S]*?)<\/svg>/, (match, svgAttrs, svgContent) => {
    const cleanedContent = svgContent
      .replace(/\sstroke-width="[^"]*"/g, "")
      .replace(/\sstroke="[^"]*"/g, "")
      .replace(/\sfill="[^"]*"/g, "");
    return `<svg${svgAttrs}>${cleanedContent}</svg>`;
  });

  // 2. Inject class + optional stroke-width into root <svg> tag
  content = content.replace(
    /<svg([\s\S]*?)>/,
    (match, attrs) =>
      `<svg${attrs} class="${className}"${
        strokeWidth != null ? ` stroke-width="${strokeWidth}"` : ""
      }>`
  );

  return (
    <span
      aria-hidden={ariaHidden}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Icon;
