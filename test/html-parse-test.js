import test from './tape-wrapper';
import {parse as _parse} from '../lib';
import queryDom from 'query-dom';
import tsml from 'tsml';
import fixtures from './fixtures';

const parse = process.browser
  ? (str) => {
    const node = document.createElement('div');
    node.innerHTML = str;
    return _parse(node.childNodes);
  }
  : str => _parse(queryDom(str));

test('parse() empty', t => {
  const actual = parse('');
  const expected = null;
  t.is(actual, expected);
});

test('parse() img', t => {
  const actual = parse('<img src="http://example.com/image.jpg" />');
  const expected = {
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined,
    alt: undefined
  };
  t.deepEqual(actual, expected);
});

test('parse() single element', t => {
  const elm = queryDom('<img src="http://example.com/image.jpg" />')[0];
  const actual = _parse(elm);
  const expected = {
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined,
    alt: undefined
  };
  t.deepEqual(actual, expected);
});

test('parse() img, with alt-attribute', t => {
  const actual = parse('<img src="http://example.com/image.jpg" alt="beep boop" />');
  const expected = {
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: undefined,
    height: undefined,
    alt: 'beep boop'
  };
  t.deepEqual(actual, expected);
});

test('parse() img with width & height', t => {
  const input = tsml`<img src="http://example.com/image.jpg" width="100" height="200" />`;
  const actual = parse(input);
  const expected = {
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200,
    alt: undefined
  };

  t.deepEqual(actual, expected);
});

test('parse() img with width & height css', t => {
  const input = tsml`<img src="http://example.com/image.jpg" style="width: 100px; height: 200px" />`;
  const actual = parse(input);
  const expected = {
    type: 'image',
    src: 'http://example.com/image.jpg',
    width: 100,
    height: 200,
    alt: undefined
  };

  t.deepEqual(actual, expected);
});

test('parse() video with src', t => {
  const input = '<video src="http://example.com/video.mp4" />';
  const actual = parse(input);
  const expected = {
    type: 'video',
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: undefined,
    height: undefined
  };
  t.deepEqual(actual, expected);
});

test('parse() video with sources', t => {
  const input = tsml`<video>
    <source src="http://example.com/video.mp4" />
    <source src="http://example.com/video2.mp4" type="video/mp4"/>
  </video>`;
  const actual = parse(input);
  const expected = {
    type: 'video',
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }, {
      src: 'http://example.com/video2.mp4',
      type: 'video/mp4'
    }],
    width: undefined,
    height: undefined
  };
  t.deepEqual(actual, expected);
});

test('parse() video with width & height', t => {
  const input = '<video src="http://example.com/video.mp4" width="100" height="200" />';
  const actual = parse(input);
  const expected = {
    type: 'video',
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
  };
  t.deepEqual(actual, expected);
});

test('parse() video with width & height css', t => {
  const input = '<video src="http://example.com/video.mp4" style="width:100px;height:200px" />';
  const actual = parse(input);
  const expected = {
    type: 'video',
    sources: [{
      src: 'http://example.com/video.mp4',
      type: null
    }],
    width: 100,
    height: 200
  };
  t.deepEqual(actual, expected);
});

test('parse() youtube iframe', t => {
  const input = `<iframe src="https://www.youtube.com/embed/pDVmldTurqk"></iframe>`;
  const actual = parse(input);
  const expected = {
    type: 'youtube',
    youtubeId: 'pDVmldTurqk'
  };
  t.deepEqual(actual, expected);
});

test('parse() youtube embedly iframe', t => {
  const input = `<iframe
    src="//cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fwww.youtube.com%2Fembed%2F3rS6mZUo3fg%3Ffeature%3Doembed"
  ></iframe>`;
  const actual = parse(input);
  const expected = {
    type: 'youtube',
    youtubeId: '3rS6mZUo3fg'
  };
  t.deepEqual(actual, expected);
});

test('parse() tweet - normal', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = {
    type: 'twitter',
    embedAs: 'tweet',
    text: [
      {content: 'GIF vs. JIF… This ', href: null},
      {content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6'}
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra'
    },
    id: '684690494841028608'
  };
  t.deepEqual(actual, expected);
});

test('parse() tweet - no a tag', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This </p>&mdash; Matt (foo) Navarra (@MattNavarra)</blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() tweet - video', t => {
  const input = `<blockquote class="twitter-video" data-lang="en"><p lang="en" dir="ltr">Surfer <a href="https://twitter.com/bethanyhamilton">@bethanyhamilton</a>, who lost her arm in a 2003 shark attack, finishes 3rd in <a href="https://twitter.com/wsl">@wsl</a> Fiji. <a href="https://twitter.com/hashtag/VideoOfTheDay?src=hash">#VideoOfTheDay</a> <a href="https://t.co/elSAwTdP6L">pic.twitter.com/elSAwTdP6L</a></p>&mdash; Twitter Video (@video) <a href="https://twitter.com/video/status/737840608895762432">June 1, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = {
    type: 'twitter',
    embedAs: 'video',
    text: [
      {content: 'Surfer ', href: null},
      {content: '@bethanyhamilton', href: 'https://twitter.com/bethanyhamilton'},
      {content: ', who lost her arm in a 2003 shark attack, finishes 3rd in ', href: null},
      {content: '@wsl', href: 'https://twitter.com/wsl'},
      {content: ' Fiji. ', href: null},
      {content: '#VideoOfTheDay', href: 'https://twitter.com/hashtag/VideoOfTheDay?src=hash'},
      {content: ' ', href: null},
      {content: 'pic.twitter.com/elSAwTdP6L', href: 'https://t.co/elSAwTdP6L'}
    ],
    url: 'https://twitter.com/video/status/737840608895762432',
    date: 'June 1, 2016',
    user: {
      slug: 'video',
      name: 'Twitter Video'
    },
    id: '737840608895762432'
  };
  t.deepEqual(actual, expected);
});

test('parse() tweet - no date', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608"></a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = {
    type: 'twitter',
    embedAs: 'tweet',
    text: [
      {content: 'GIF vs. JIF… This ', href: null},
      {content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6'}
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: '',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra'
    },
    id: '684690494841028608'
  };
  t.deepEqual(actual, expected);
});

test('parse() tweet - weird input', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">foo bar<beep>boop</beep></p>&mdash; Matt Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input).text;
  const expected = [
    {content: 'foo bar', href: null}
  ];
  t.deepEqual(actual, expected);
});

test('parse() tweet - no paragraph, no user', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><a href="https://twitter.com/MattNavarra/status/684690494841028608">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = {
    type: 'twitter',
    embedAs: 'tweet',
    text: [],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608',
    date: 'January 6, 2016',
    user: {
      slug: null,
      name: null
    },
    id: '684690494841028608'
  };
  t.deepEqual(actual, expected);
});

test('parse() tweet - no id', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) </blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() tweet - href has query string', t => {
  const input = `<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">GIF vs. JIF… This <a href="https://t.co/qFAHWgdbL6">pic.twitter.com/qFAHWgdbL6</a></p>&mdash; Matt (foo) Navarra (@MattNavarra) <a href="https://twitter.com/MattNavarra/status/684690494841028608?ref_src=twsrc%5Etfw">January 6, 2016</a></blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;
  const actual = parse(input);
  const expected = {
    type: 'twitter',
    embedAs: 'tweet',
    text: [
      {content: 'GIF vs. JIF… This ', href: null},
      {content: 'pic.twitter.com/qFAHWgdbL6', href: 'https://t.co/qFAHWgdbL6'}
    ],
    url: 'https://twitter.com/MattNavarra/status/684690494841028608?ref_src=twsrc%5Etfw',
    date: 'January 6, 2016',
    user: {
      slug: 'MattNavarra',
      name: 'Matt (foo) Navarra'
    },
    id: '684690494841028608'
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram http iframe', t => {
  const input = `<iframe src="http://instagram.com/p/fdx1CSuEPV/embed"></iframe>`;
  const actual = parse(input);
  const expected = {
    type: 'instagram',
    text: '',
    id: 'fdx1CSuEPV',
    url: 'https://instagram.com/p/fdx1CSuEPV'
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram https iframe', t => {
  const input = `<iframe src="https://instagram.com/p/fdx1CSuEPV/embed"></iframe>`;
  const actual = parse(input);
  const expected = {
    type: 'instagram',
    text: '',
    id: 'fdx1CSuEPV',
    url: 'https://instagram.com/p/fdx1CSuEPV'
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram www iframe', t => {
  const input = `<iframe src="http://www.instagram.com/p/fdx1CSuEPV/embed"></iframe>`;
  const actual = parse(input);
  const expected = {
    type: 'instagram',
    text: '',
    id: 'fdx1CSuEPV',
    url: 'https://instagram.com/p/fdx1CSuEPV'
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram - with caption', t => {
  const input = fixtures.instagramCaption;
  const actual = parse(input);
  const expected = {
    type: 'instagram',
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: 'Reinsta @karinn In Berlin. Feeling awesome.',
    user: {
      name: 'David Björklund',
      slug: 'david_bjorklund'
    },
    date: {
      utc: '2015-12-05T21:40:53+00:00',
      string: 'Dec 5, 2015 at 1:40pm PST'
    }
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram - without caption', t => {
  const input = fixtures.instagramWithoutCaption;
  const actual = parse(input);
  const expected = {
    type: 'instagram',
    id: '-7PIhyA6J3',
    url: 'https://www.instagram.com/p/-7PIhyA6J3/',
    text: null,
    user: {
      name: 'David Björklund',
      slug: 'david_bjorklund'
    },
    date: {
      utc: '2015-12-05T21:40:53+00:00',
      string: 'Dec 5, 2015 at 1:40pm PST'
    }
  };
  t.deepEqual(actual, expected);
});

test('parse() instagram - bad input', t => {
  const input = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`;
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() facebook - post', t => {
  const input = fixtures.facebookPost;
  const actual = parse(input);
  const expected = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    type: 'facebook',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - post with invalid link', t => {
  const input = fixtures.facebookPostInvalid;
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() facebook - post with embed code', t => {
  const input = `${fixtures.facebookEmbedCode}${fixtures.facebookPost}`;
  const actual = parse(input);
  const expected = {
    url: 'https://www.facebook.com/david.bjorklund/posts/10153809692501070',
    type: 'facebook',
    embedAs: 'post',
    date: 'Thursday, January 21, 2016',
    user: 'David Pop Hipsterson',
    text: [{
      content: 'Hey!So, for the last few weeks I\'ve worked on http://mic.com/ - the new home for mic.com (on desktop) - please take a look :)',
      href: null
    }]
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - photo', t => {
  const input = fixtures.facebookPhoto;
  const actual = parse(input);
  const expected = {
    embedAs: 'photo',
    type: 'facebook',
    url: 'https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738',
    text: [{
      content: 'via Tumblr user kristine-claire.',
      href: null
    }],
    date: 'Tuesday, June 17, 2014',
    user: 'Rewire'
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - photo with embed code', t => {
  const input = `${fixtures.facebookEmbedCode}${fixtures.facebookPhoto}`;
  const actual = parse(input);
  const expected = {
    embedAs: 'photo',
    type: 'facebook',
    url: 'https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738',
    text: [{
      content: 'via Tumblr user kristine-claire.',
      href: null
    }],
    date: 'Tuesday, June 17, 2014',
    user: 'Rewire'
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - video', t => {
  const input = fixtures.facebookVideo;
  const actual = parse(input);
  const expected = {
    url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
    type: 'facebook',
    embedAs: 'video',
    headline: 'Why is breastfeeding in public such a big deal?',
    date: 'Friday, January 15, 2016',
    user: {
      url: 'https://www.facebook.com/MicMedia/',
      name: 'Mic'
    },
    text: [
      {
        content: 'Men and women *both* have nipples — so why do we only shame women for showing theirs... especially when they\'re breastfeeding?',
        href: null
      }
    ]
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - video with embed code', t => {
  const input = `${fixtures.facebookEmbedCode}${fixtures.facebookVideo}`;
  const actual = parse(input);
  const expected = {
    url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
    type: 'facebook',
    embedAs: 'video',
    headline: 'Why is breastfeeding in public such a big deal?',
    date: 'Friday, January 15, 2016',
    user: {
      url: 'https://www.facebook.com/MicMedia/',
      name: 'Mic'
    },
    text: [
      {
        content: 'Men and women *both* have nipples — so why do we only shame women for showing theirs... especially when they\'re breastfeeding?',
        href: null
      }
    ]
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - video invalid', t => {
  const input = fixtures.facebookVideoInvalid;
  const actual = parse(input);
  const expected = {
    embedAs: 'video',
    type: 'facebook',
    url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
    headline: '',
    date: '',
    user: {
      url: '',
      name: ''
    },
    text: []
  };
  t.deepEqual(actual, expected);
});

test('parse() facebook - video invalid 2', t => {
  const input = fixtures.facebookVideoInvalid2;
  const actual = parse(input);
  const expected = {
    embedAs: 'video',
    type: 'facebook',
    url: 'https://www.facebook.com/MicMedia/videos/1060315987324524/',
    headline: '',
    date: '1',
    user: {
      url: '',
      name: ''
    },
    text: []
  };
  t.deepEqual(actual, expected);
});

test('parse() vine', t => {
  const input = '<iframe src="https://vine.co/v/bjHh0zHdgZT/embed/simple" width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>';
  const actual = parse(input);
  const expected = {
    id: 'bjHh0zHdgZT',
    type: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  };
  t.deepEqual(actual, expected);
});

test('parse() vine embedly', t => {
  const input = '<iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;url=https%3A%2F%2Fvine.co%2Fv%2FbjHh0zHdgZT%2Fembed%2Fsimple&amp;image=https%3A%2F%2Fv.cdn.vine.co%2Fr%2Fthumbs%2F8B474922-0D0E-49AD-B237-6ED46CE85E8A-118-000000FFCD48A9C5_1.0.6.mp4.jpg%3FversionId%3D5mzXl2DXYBvKvF9rhcp.nvEJC.1N86RG&amp;key=25bf3602073943478e54668402a4f5a8&amp;type=text%2Fhtml&amp;schema=vine" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = {
    id: 'bjHh0zHdgZT',
    type: 'vine',
    url: 'https://vine.co/v/bjHh0zHdgZT/embed/simple'
  };
  t.deepEqual(actual, expected);
});

test('parse() spotify', t => {
  const input = '<iframe src="https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
  const actual = parse(input);
  const expected = {
    type: 'spotify',
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    spotifyUri: 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    width: 300,
    height: 380
  };
  t.deepEqual(actual, expected);
});

test('parse() spotify no size', t => {
  const input = '<iframe src="https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf"></iframe>';
  const actual = parse(input);
  const expected = {
    type: 'spotify',
    url: 'https://embed.spotify.com/?uri=spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    spotifyUri: 'spotify:user:spotify:playlist:3rgsDhGHZxZ9sB9DQWQfuf',
    width: 300,
    height: 80
  };
  t.deepEqual(actual, expected);
});

test('parse() spotify no uri', t => {
  const input = '<iframe src="https://embed.spotify.com/abc"></iframe>';
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() iframe no src', t => {
  const input = '<iframe class="embedly-embed" width="600" height="600" scrolling="no" frameborder="0" allowfullscreen=""></iframe>';
  const actual = parse(input);
  const expected = null;
  t.deepEqual(actual, expected);
});

test('parse() tumblr embed', t => {
  const input = fixtures.tumblrPost;
  const actual = parse(input);
  const expected = {
    type: 'tumblr',
    did: '7c08ba46cb75162284770cdee2a59365891a5e18',
    url: 'https://embed.tumblr.com/embed/post/8_SX4ALNOf1fYyEcjq78YQ/147291233392',
    text: [{
      content: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento',
      href: 'http://jencita.tumblr.com/post/147291233392/tswiftdaily-taylor-swift-at-lady-cilento'
    }]
  };
  t.deepEqual(actual, expected);
});

test('parse() tidal video', t => {
  const input = fixtures.tidalVideo;
  const actual = parse(input);
  const expected = {
    type: 'tidal',
    dataType: 'v',
    dataId: '63196259'
  };
  t.deepEqual(actual, expected);
});

test('parse() custom embed', t => {
  const input = '<iframe src="http://custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = {
    type: 'custom',
    src: 'http://custom.com',
    width: 600,
    height: 600,
    secure: false
  };
  t.deepEqual(actual, expected);
});

test('parse() custom secure embed', t => {
  const input = '<iframe src="https://custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = {
    type: 'custom',
    src: 'https://custom.com',
    width: 600,
    height: 600,
    secure: true
  };
  t.deepEqual(actual, expected);
});

test('parse() custom secure embed with no protocol', t => {
  const input = '<iframe src="//custom.com" width="600" height="600" frameborder="0"></iframe>';
  const actual = parse(input);
  const expected = {
    type: 'custom',
    src: '//custom.com',
    width: 600,
    height: 600,
    secure: true
  };
  t.deepEqual(actual, expected);
});
