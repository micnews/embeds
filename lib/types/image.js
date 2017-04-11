import React from 'react';
import getDimensions from '../dimensions';

export const parse = ([elm]) => {
  const tagName = elm.tagName.toLowerCase();

  if (tagName === 'img') {
    const { width, height } = getDimensions(elm);

    return {
      type: 'image',
      src: elm.getAttribute('src'),
      alt: elm.getAttribute('alt') || undefined,
      width,
      height,
    };
  }

  return null;
};

export const render = ({ src, alt, width, height }) =>
  <img src={src} alt={alt} width={width} height={height} />;

render.propTypes = {
  src: React.PropTypes.string.isRequired,
  alt: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.height,
};
