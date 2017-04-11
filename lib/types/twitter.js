import React from 'react';
import find from 'lodash.find';
import last from 'lodash.last';
import parseText from '../parse-text';
import renderText from '../render-text';

const type = 'twitter';

const getText = elm => {
  const pElm = elm.getElementsByTagName('p')[0];
  return parseText(pElm);
};

const getUser = elm => {
  const userElm = find(elm.childNodes, child => child.nodeName === '#text');
  if (!userElm) {
    return {
      name: null,
      slug: null
    };
  }
  const userString = userElm.data;
  const lastIndex = userString.lastIndexOf('(');
  const userName = userString.slice(2, lastIndex).trim();
  const userSlug = userString.slice(lastIndex + 2, -2);

  return {
    name: userName,
    slug: userSlug
  };
};

export const parse = ([elm]) => {
  if (!elm.classList.contains('twitter-tweet') && !elm.classList.contains('twitter-video')) {
    return null;
  }

  const embedAs = elm.classList.contains('twitter-video') ? 'video' : 'tweet';

  const aElm = last(elm.getElementsByTagName('a'));
  if (!aElm) {
    return null;
  }

  const url = aElm.getAttribute('href');
  const id = last(url.split('/').filter(Boolean)).split('?')[0];
  const date = aElm.childNodes.length > 0 ? aElm.childNodes[0].data : '';
  const user = getUser(elm);
  const text = getText(elm);

  if (!/^\d+$/.test(id)) {
    return null;
  }

  return { embedAs, user, date, text, id, url, type };
};

const renderUser = user =>
  (user && user.name && user.slug
  ? `\u2014 ${user.name} (@${user.slug}) `
  : '');

const renderVideo = ({ text, url, date, user }) =>
  (<blockquote className='twitter-video' data-lang='en'>
    <p lang='en' dir='ltr'>{renderText(text)}</p>
    {renderUser(user)}
    <a href={url}>{date}</a>
  </blockquote>);

const renderTweet = ({ text, url, date, user }) =>
  (<blockquote className='twitter-tweet' data-lang='en'>
    <p lang='en' dir='ltr'>{renderText(text)}</p>
    {renderUser(user)}
    <a href={url}>{date}</a>
  </blockquote>);

renderVideo.propTypes = renderTweet.propTypes = {
  text: React.PropTypes.string,
  url: React.PropTypes.string,
  user: React.PropTypes.string,
  date: React.PropTypes.string
};

const renderTypes = {
  video: renderVideo,
  tweet: renderTweet
};

export const render = opts => (renderTypes[opts.embedAs]
  ? renderTypes[opts.embedAs](opts)
  : renderTypes.tweet(opts));
