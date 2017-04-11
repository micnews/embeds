import startsWith from 'lodash.startswith';
import nodeUrl from 'url';
import renderIframe from '../render-iframe';

const type = 'spotify';

const checkSrc = src => startsWith(src, 'https://embed.spotify.com/');

export const parse = ([elm]) => {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  if (!src) {
    return null;
  }

  const width = Number(elm.getAttribute('width')) || 300;
  const height = Number(elm.getAttribute('height')) || 80;

  const url = src;
  if (!checkSrc(url)) {
    return null;
  }

  const parsed = nodeUrl.parse(url, true);
  const spotifyUri = parsed.query.uri || '';
  if (!spotifyUri) {
    return null;
  }

  return { type, url, spotifyUri, width, height };
};

export const render = ({ url, height = 80 }) => renderIframe({
  src: url, width: '100%', height,
});
