/* eslint-disable import/no-extraneous-dependencies */

import { renderToStaticMarkup } from 'react-dom/server';
import tsml from 'tsml';
import test from './tape-wrapper';
import { render as _render } from '../lib';
import fixtures from './fixtures';
import renderText from '../lib/render-text';

const render = opts => renderToStaticMarkup(_render(opts));

test('render() img', (t) => {
  const actual = render({
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined,
    alt: undefined,
  });
  const expected = '<img src="http://example.com/image.jpg"/>';
  t.is(actual, expected);
});

test('render() img, with alt-attribute', (t) => {
  const actual = render({
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined,
    alt: 'beep boop',
  });
  const expected = '<img src="http://example.com/image.jpg" alt="beep boop"/>';
  t.is(actual, expected);
});

test('render() img with width & height', (t) => {
  const actual = render({
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200,
    alt: undefined,
  });
  const expected = '<img src="http://example.com/image.jpg" width="100" height="200"/>';
  t.is(actual, expected);
});

test('render() video  ', (t) => {
  const actual = render({
    type: 'video',
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null,
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4',
    }],
    width: 100,
    height: 200,
  });
  const expected = tsml`<video width="100" height="200">
    <source src="http://example.com/video.mp4"/>
    <source src="http://example.com/video2.mp4" type="video/mp4"/>
  </video>`;
  t.is(actual, expected);
});

test('render() youtube iframe', (t) => {
  const actual = render({
    type: 'youtube',
    youtubeId: 'pDVmldTurqk',
  });
  const expected = '<iframe src="https://www.youtube.com/embed/pDVmldTurqk" width="640" height="360" frameborder="0" allowfullscreen=""></iframe>';
  t.is(actual, expected);
});

test('render() youtube iframe custom width & height', (t) => {
  const actual = render({
    type: 'youtube',
    youtubeId: 'pDVmldTurqk',
    width: 800,
    height: 600,
  });
  const expected = '<iframe src="https://www.youtube.com/embed/pDVmldTurqk" width="800" height="600" frameborder="0" allowfullscreen=""></iframe>';
  t.is(actual, expected);
});

test('render() tweet - normal', (t) => {
  const input = {
    type: 'twitter',
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' },
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra',
    },
    id: '684690494841028608',
  };
  const actual = render(input);
  const expected = tsml`<blockquote class="twitter-tweet" data-lang="en">
    <p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>\u2014 Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a>
  </blockquote>`;
  t.is(actual, expected);
});

test('render() tweet with no user slug', (t) => {
  const input = {
    type: 'twitter',
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' },
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: null,
      name: 'Matt (foo) Navarra',
    },
    id: '684690494841028608',
  };
  const actual = render(input);
  const expected = fixtures.tweetNoUser;
  t.is(actual, expected);
});

test('render() tweet with no user name', (t) => {
  const input = {
    type: 'twitter',
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' },
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: 'MattNavarra',
      name: null,
    },
    id: '684690494841028608',
  };
  const actual = render(input);
  const expected = fixtures.tweetNoUser;
  t.is(actual, expected);
});

test('render() tweet with no user', (t) => {
  const input = {
    type: 'twitter',
    text: [
      { content: 'GIF vs. JIF… This ', href: null },
      { content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6' },
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: null,
    id: '684690494841028608',
  };
  const actual = render(input);
  const expected = fixtures.tweetNoUser;
  t.is(actual, expected);
});

test('render() instagram - with caption', (t) => {
  const input = {
    type: 'instagram',
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: 'Reinsta @karinn In Berlin. Feeling awesome.',
    user: {
      name: 'David Björklund',
      slug: 'david_bjorklund',
    },
    date: {
      utc: '2015-12-05T21:40:53+00:00',
      string: 'Dec 5, 2015 at 1:40pm PST',
    },
  };
  const actual = render(input);
  const expected = fixtures.instagramCaption;
  t.is(actual, expected);
});

test('render() instagram - without caption', (t) => {
  const input = {
    type: 'instagram',
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: null,
    user: {
      name: 'David Björklund',
      slug: 'david_bjorklund',
    },
    date: {
      utc: '2015-12-05T21:40:53+00:00',
      string: 'Dec 5, 2015 at 1:40pm PST',
    },
  };
  const actual = render(input);
  const expected = fixtures.instagramWithoutCaption;
  t.is(actual, expected);
});

test('render() facebook - post', (t) => {
  const input = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    type: 'facebook',
    embedAs: 'post',
    user: 'David Pop Hipsterson',
    date: 'Thursday, January 21, 2016',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null,
    }],
  };
  const actual = render(input);
  const expected = fixtures.facebookPost;
  t.is(actual, expected);
});

test('render() facebook - video', (t) => {
  const input = {
    url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
    type: 'facebook',
    embedAs: 'video',
    user: {
      name: 'Mic',
      url: 'https://www.facebook.com/MicMedia/',
    },
    text: [{
      content: 'Men and women *both* have nipples — so why do we ' +
        'only shame women for showing theirs... especially when they\'re breastfeeding?',
      href: null,
    }],
    headline: 'Why is breastfeeding in public such a big deal?',
    date: 'Friday, January 15, 2016',
  };
  const actual = render(input);
  const expected = fixtures.facebookVideo;
  t.is(actual, expected);
});

test('reder() facebook - photo', (t) => {
  const input = {
    url: 'https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738',
    type: 'facebook',
    embedAs: 'photo',
    user: 'Rewire',
    date: 'Tuesday, June 17, 2014',
    text: [{
      content: 'via Tumblr user kristine-claire.',
      href: null,
    }],
  };
  const actual = render(input);
  const expected = fixtures.facebookPhoto;
  t.is(actual, expected);
});

test('render() custom', (t) => {
  const input = {
    type: 'custom',
    src: 'http://custom.com',
    width: 600,
    height: 600,
    secure: false,
  };
  const actual = render(input);
  const expected = '<iframe src="http://custom.com" width="600" height="600" frameborder="0"></iframe>';
  t.is(actual, expected);
});

test('render() custom, allow fullscreen', (t) => {
  const input = {
    type: 'custom',
    src: 'http://custom.com',
    width: 600,
    height: 600,
    secure: false,
    allowFullscreen: true,
  };
  const actual = render(input);
  const expected = '<iframe src="http://custom.com" width="600" height="600" frameborder="0" allowfullscreen=""></iframe>';
  t.is(actual, expected);
});

test('render() vine', (t) => {
  const input = {
    id: 'bjHh0zHdgZT',
    type: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple',
  };
  const actual = render(input);
  const expected = '<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple" width="600" height="600" frameborder="0"></iframe>';
  t.is(actual, expected);
});

test('render() vine, custom size', (t) => {
  const input = {
    id: 'bjHh0zHdgZT',
    type: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple',
    size: 400,
  };
  const actual = render(input);
  const expected = '<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple" width="400" height="400" frameborder="0"></iframe>';
  t.is(actual, expected);
});

test('render() spotify, custom size', (t) => {
  const input = {
    spotifyUri: 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    type: 'spotify',
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    width: 400,
    height: 300,
  };
  const actual = render(input);
  const expected = '<iframe src="https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf" width="100%" height="300" frameborder="0"></iframe>';
  t.is(actual, expected);
});

test('render() spotify, default size', (t) => {
  const input = {
    spotifyUri: 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    type: 'spotify',
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
  };
  const actual = render(input);
  const expected = '<iframe src="https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf" width="100%" height="80" frameborder="0"></iframe>';
  t.is(actual, expected);
});

test('render() tumblr', (t) => {
  const input = {
    type: 'tumblr',
    did: '7c08ba46cb75162284770cdee2a59365891a5e18',
    url: 'https://embed.tumblr.com/embed/post/8_SX4ALNOf1fYyEcjq78YQ/147291233392',
    text: [{
      content: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento',
      href: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento',
    }],
  };
  const actual = render(input);
  const expected = fixtures.tumblrPost;
  t.is(actual, expected);
});

test('renderText()', (t) => {
  t.deepEqual(renderText(undefined), []);
  t.deepEqual(renderText(null), []);
  t.deepEqual(renderText([]), []);
});
