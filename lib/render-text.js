import React from 'react';

export default text =>
  (text || []).map(({ content, href }, index) =>
    (href
    ? <a href={href} key={index}>{content}</a>
    : content),
  );
