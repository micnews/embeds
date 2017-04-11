import React from 'react';
import map from 'lodash.map';
import getDimensions from '../dimensions';

const type = 'video';

const getSources = (elm) => {
  const sourceElms = elm.getElementsByTagName('source');

  if (sourceElms.length) {
    return map(sourceElms, sourceElm => ({
      src: sourceElm.getAttribute('src'),
      type: sourceElm.getAttribute('type') || null,
    }));
  }

  return [{
    src: elm.getAttribute('src'),
    type: null,
  }];
};

export const parse = ([elm]) => {
  const tagName = elm.tagName.toLowerCase();

  if (tagName === 'video') {
    const { width, height } = getDimensions(elm);
    const sources = getSources(elm);

    return {
      type, sources, width, height,
    };
  }

  return null;
};

const renderSource = ({ src, type: sourceType }, index) =>
  <source src={src} type={sourceType} key={index} />;

renderSource.propTypes = {
  src: React.PropTypes.string,
  type: React.PropTypes.string,
};

export const render = ({ sources, width, height }) =>
  <video width={width} height={height}>
    {sources.map(renderSource)}
  </video>;

render.propTypes = {
  sources: React.PropTypes.array,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};
