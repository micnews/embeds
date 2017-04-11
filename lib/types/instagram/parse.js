import last from 'lodash.last';

const type = 'instagram';

const getUserElm = elmArg => {
  let elm = elmArg;
  while (elm && elm.childNodes) {
    elm = elm.childNodes[0];

    if (elm && elm.nodeName === '#text') {
      return elm;
    }
  }

  return null;
};

const getUser = elm => {
  const userElm = getUserElm(elm);
  if (!userElm) {
    return { name: null, slug: null };
  }
  const userString = userElm.data;
  const lastIndex = userString.lastIndexOf('(');
  const name = userString.slice(2, lastIndex).replace('photo posted by', '').trim();
  const slug = userString.slice(lastIndex + 2, userString.lastIndexOf(')'));

  return { name, slug };
};

const getDate = elm => {
  const time = elm && elm.getElementsByTagName('time')[0];
  if (!time) {
    return { urc: null, string: null };
  }
  return {
    utc: time.getAttribute('datetime'),
    string: time.childNodes[0].data
  };
};

function testInstagramMediaEmbed(elm) {
  if (!elm.classList.contains('instagram-media')) {
    return null;
  }

  const paragraphs = elm.getElementsByTagName('p');
  if (!paragraphs[0]) {
    return null;
  }

  const postLink = paragraphs[0].getElementsByTagName('a')[0];
  const text = (elm.hasAttribute('data-instgrm-captioned') && postLink.childNodes[0])
    ? postLink.childNodes[0].data : null;
  const url = postLink.getAttribute('href');
  const id = last(url.split('/').filter(Boolean));
  const user = getUser(last(paragraphs));
  const date = getDate(last(paragraphs));

  return { type, text, url, id, user, date };
}

const regexp = /https?:\/\/(www.)?instagram\.com\/p\/([A-Za-z0-9_-]+)\/embed/;

function testInstagramIframe(elm) {
  if (elm.tagName.toLowerCase() !== 'iframe') {
    return null;
  }

  const url = elm.getAttribute('src') || '';
  const match = url.match(regexp);
  if (!match) {
    return null;
  }

  const id = match[2];

  return { type, text: '', url: `https://instagram.com/p/${id}`, id };
}

export default ([elm]) => testInstagramMediaEmbed(elm) || testInstagramIframe(elm);
