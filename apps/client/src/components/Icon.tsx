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

  // 1. Remove all stroke-width="... inside <path>, <line>, etc.
  content = content.replace(/stroke-width="[^"]*"/g, "");

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
