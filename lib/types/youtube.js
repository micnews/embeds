import { parse as parseEmbedly } from 'embedly-url';
import getYoutubeId from 'get-youtube-id';
import renderIframe from '../render-iframe';

export const parse = ([elm]) => {
  const tagName = elm.tagName.toLowerCase();

  if (tagName !== 'iframe') {
    return null;
  }

  const src = elm.getAttribute('src');
  if (!src) {
    return null;
  }

  const embedlyParsed = parseEmbedly(src);
  const youtubeId = embedlyParsed
    ? getYoutubeId(embedlyParsed.src) : getYoutubeId(src);
  return youtubeId && {
    type: 'youtube',
    youtubeId,
  };
};

export const render = ({ youtubeId, width = 640, height = 360 }) => renderIframe({
  src: `https://www.youtube.com/embed/${youtubeId}`,
  width,
  height,
  allowFullscreen: true,
});
