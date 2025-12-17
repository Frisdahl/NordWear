import React from 'react';

interface HeaderSpacerProps {
  height: number;
}

const HeaderSpacer: React.FC<HeaderSpacerProps> = ({ height }) => {
  return <div style={{ height: `${height}px` }} />;
};

export default HeaderSpacer;
