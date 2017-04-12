import React from 'react';

export const parse = ([elm]) => {
  if (!elm.classList.contains('tidal-embed')) {
    return null;
  }

  const dataType = elm.getAttribute('data-type');
  const dataId = elm.getAttribute('data-id');
  return { type: 'tidal', dataType, dataId };
};

export const render = ({ dataType, dataId }) =>
  <div className='tidal-embed' data-type={dataType} data-id={dataId} />
;

render.propTypes = {
  dataType: React.PropTypes.string.isRequired,
  dataId: React.PropTypes.string.isRequired,
};
