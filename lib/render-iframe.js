import React from 'react';

function renderIframe({ src, width, height, allowFullscreen }) {
  return (<iframe
    src={src}
    width={width}
    height={height}
    frameBorder='0'
    allowFullScreen={allowFullscreen}
  />);
}

renderIframe.propTypes = {
  src: React.PropTypes.string,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  allowFullscreen: React.PropTypes.bool,
};

export default renderIframe;
