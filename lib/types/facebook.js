const type = 'facebook';
import element from 'virtual-element';
import parseText from '../parse-text';
import renderText from '../render-text';
import parseInput from '../parse-input';
import last from 'lodash.last';

const parsePost = elm => {
  const url = elm.getAttribute('data-href');
  const parsed = parseInput(url);
  if (!parsed) {
    return null;
  }

  const embedAs = parsed.embedAs;
  const pElm = elm.getElementsByTagName('p')[0];
  const text = parseText(pElm);
  const aElms = elm.getElementsByTagName('a') || [];
  const user = aElms[0] && aElms[0].childNodes[0] ? aElms[0].childNodes[0].data : '';
  const date = aElms[1] && aElms[1].childNodes[0] ? aElms[1].childNodes[0].data : '';

  return {embedAs, type, url, text, date, user};
};

const parseVideo = elm => {
  const url = elm.getAttribute('data-href');
  const embedAs = 'video';
  const aElms = elm.getElementsByTagName('a') || [];
  const headline = aElms[0] && aElms[0].childNodes[0] ? aElms[0].childNodes[0].data : '';
  const blockquoteElm = elm.getElementsByTagName('blockquote')[0];
  const date = blockquoteElm ? ((last(blockquoteElm.childNodes) || {}).data || '').replace(' on ', '') : '';
  const user = {
    url: aElms[1] && aElms[1].getAttribute('href') || '',
    name: aElms[1] && aElms[1].childNodes[0] && aElms[1].childNodes[0].data || ''
  };
  const pElm = elm.getElementsByTagName('p')[0];
  const text = parseText(pElm);

  return {embedAs, type, url, headline, date, user, text};
};

const parseElm = elm => {
  if (!elm.classList.contains('fb-post') && !elm.classList.contains('fb-video')) {
    return null;
  }

  return elm.classList.contains('fb-video') ? parseVideo(elm) : parsePost(elm);
};

export const parse = elements => {
  for (let i = 0; i < elements.length; ++i) {
    let results = parseElm(elements[i]);
    if (results) {
      return results;
    }
  }
  return null;
};

const renderVideo = ({url, user, text, headline, date}) =>
  (<div class='fb-video' data-allowfullscreen='1' data-href={url}>
    <div class='fb-xfbml-parse-ignore'>
      <blockquote cite={url}>
        <a href={url}>{headline}</a>
        <p>{renderText(text)}</p>
        Posted by <a href={user.url}>{user.name}</a> on {date}
      </blockquote>
    </div>
  </div>);

const renderPost = ({url, user, date, text}) =>
  (<div class='fb-post' data-href={url} data-width='500'>
    <div class='fb-xfbml-parse-ignore'>
      <blockquote cite={url}>
        <p>{renderText(text)}</p>
        Posted by <a href='#' role='button'>{user}</a> on <a href={url}>{date}</a>
      </blockquote>
    </div>
  </div>);

const renderTypes = {
  video: renderVideo,
  post: renderPost,
  photo: renderPost
};

export const render = opts => renderTypes[opts.embedAs] ? renderTypes[opts.embedAs](opts) : renderTypes.post(opts);
