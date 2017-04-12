import map from 'lodash.map';

export default (elm) => {
  if (!elm) {
    return [];
  }

  return map(elm.childNodes, (child) => {
    if (child.nodeName === '#text') {
      return {
        content: child.data,
        href: null,
      };
    }

    if (child.tagName.toLowerCase() === 'a') {
      return {
        content: child.childNodes[0].data,
        href: child.getAttribute('href'),
      };
    }

    return null;
  }).filter(Boolean);
};
