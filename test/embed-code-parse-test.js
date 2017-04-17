import test from './tape-wrapper';
import {parseInput} from '../lib';
import tsml from 'tsml';
import {render, parse as _parse} from '../lib';
import {renderString, tree} from 'deku';
import queryDom from 'query-dom';


const parse = process.browser
  ? (str) => {
    const node = document.createElement('div');
    node.innerHTML = str;
    return _parse(node.childNodes);
  }
  : str => _parse(queryDom(str));

const renderAndParse = input =>
  parse(renderString(tree(render(input))));

test('parse invalid input', t => {
  t.is(parseInput(), null);
  t.is(parseInput(null), null);
  t.is(parseInput(''), null);
  t.is(parseInput('https://unknown.com/embed/ABCde'), null);
});

test('parse instagram', t => {
  const expected = {
    type: 'instagram',
    text: '',
    url: 'https://www.instagram.com/p/tsxp1hhQTG',
    id: 'tsxp1hhQTG'
  };

  t.deepEqual(parseInput('https://www.instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('http://www.instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('//www.instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('https://instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('http://instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('//instagram.com/p/tsxp1hhQTG'), expected);
  t.deepEqual(parseInput('https://instagram.com/p/tsxp1hhQTG/'), expected);
  t.deepEqual(parseInput('http://instagram.com/p/tsxp1hhQTG/'), expected);
  t.deepEqual(parseInput('//instagram.com/p/tsxp1hhQTG/'), expected);
  t.deepEqual(parseInput('https://instagram.com/p/tsxp1hhQTG/embed'), expected);
  t.deepEqual(parseInput('http://instagram.com/p/tsxp1hhQTG/embed'), expected);
  t.deepEqual(parseInput('//instagram.com/p/tsxp1hhQTG/embed'), expected);
  t.deepEqual(
    parseInput('<iframe src="//instagram.com/p/tsxp1hhQTG"></iframe>'),
    expected
  );
});

test('giphy', t => {
  const expected = {
    type: 'giphy',
    text: '',
    url: 'https://giphy.com/embed/3oxRmeLK7bjcq0CCCA',
    id: '3oxRmeLK7bjcq0CCCA'
  };

  const code = tsml`
    <iframe src="//giphy.com/embed/3oxRmeLK7bjcq0CCCA" width="480" height="269" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
    <p>
      <a href="http://giphy.com/gifs/new-girl-fox-new-girl-newgirl-3oxRmeLK7bjcq0CCCA">
        via GIPHY
      </a>
    </p>`;

  t.deepEqual(parseInput('https://giphy.com/embed/3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput('http://giphy.com/embed/3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput('//giphy.com/embed/3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput('https://giphy.com/gifs/new-girl-fox-new-girl-newgirl-3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput('https://giphy.com/gifs/new-girl-fox-new-girl-newgirl-3oxRmeLK7bjcq0CCCA/'), expected);
  t.deepEqual(parseInput('http://giphy.com/gifs/new-girl-fox-new-girl-newgirl-3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput('//giphy.com/gifs/new-girl-fox-new-girl-newgirl-3oxRmeLK7bjcq0CCCA'), expected);
  t.deepEqual(parseInput(code), expected);
});

test('facebook', t => {
  const videoCode = tsml`
    <div id="fb-root"></div>
    <script>
      (function(d, s, id) {
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) return;
       js = d.createElement(s);
       js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
       fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
    </script>
    <div class="fb-video" data-allowfullscreen="1" data-href="https://www.facebook.com/MicMedia/videos/1095905927098863/">
      <div class="fb-xfbml-parse-ignore">
        <blockquote cite="https://www.facebook.com/MicMedia/videos/1095905927098863/">
          <a href="https://www.facebook.com/MicMedia/videos/1095905927098863/">
            This exoskeleton is literally changing lives.
          </a>
        <p>An incredible device is helping paraplegics walk again. #MicCheckNow</p>
        Posted by <a href="https://www.facebook.com/MicMedia/">Mic</a> on Thursday, March 17, 2016
        </blockquote>
      </div>
    </div>`;

  const postCode = tsml`
    <div id="fb-root"></div>
    <script>
      (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3";
      fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
    </script>
    <div class="fb-post" data-href="https://www.facebook.com/zuck/posts/10102593740125791" data-width="500">
      <div class="fb-xfbml-parse-ignore">
        <blockquote cite="https://www.facebook.com/zuck/posts/10102593740125791">
          <p>February 4 is Facebook&#x2019;s 12th birthday!Our anniversary has a lot of meaning to me as an opportunity to reflect on how...</p>
          Posted by <a href="https://www.facebook.com/zuck">Mark Zuckerberg</a> on&nbsp;
          <a href="https://www.facebook.com/zuck/posts/10102593740125791">
            Tuesday, January 12, 2016
          </a>
        </blockquote>
      </div>
    </div>`;

  const photoCode = tsml`
    <div class="fb-post" data-href="https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738/?type=3" data-width="500" data-show-text="true">
      <div class="fb-xfbml-parse-ignore">
        <blockquote cite="https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738/?type=3">
          <p>via Tumblr user kristine-claire.</p>
          Posted by <a href="https://www.facebook.com/rewire.news/">Rewire</a> on&nbsp;
          <a href="https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738/?type=3">
            Tuesday, June 17, 2014
          </a>
        </blockquote>
      </div>
    </div>`;

  const expectedVideo = {
    type: 'facebook',
    embedAs: 'video',
    user: 'MicMedia',
    url: 'https://www.facebook.com/MicMedia/videos/1095905927098863',
    id: '1095905927098863'
  };

  const expectedPost = {
    type: 'facebook',
    embedAs: 'post',
    user: 'zuck',
    url: 'https://www.facebook.com/zuck/posts/10102593740125791',
    id: '10102593740125791'
  };

  t.deepEqual(parseInput(videoCode), expectedVideo);
  t.deepEqual(
    parseInput('https://www.facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );
  t.deepEqual(
    parseInput('http://www.facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );
  t.deepEqual(
    parseInput('//www.facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );
  t.deepEqual(
    parseInput('https://facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );
  t.deepEqual(
    parseInput('http://facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );
  t.deepEqual(
    parseInput('//facebook.com/MicMedia/videos/1095905927098863'),
    expectedVideo
  );

  t.is(
    renderAndParse(expectedVideo).url,
    expectedVideo.url
  );

  t.deepEqual(parseInput(postCode), expectedPost);
  t.deepEqual(
    parseInput('https://www.facebook.com/zuck/posts/10102593740125791'),
    expectedPost
  );
  t.deepEqual(
    parseInput('http://www.facebook.com/zuck/posts/10102593740125791'),
    expectedPost
  );
  t.deepEqual(
    parseInput('//www.facebook.com/zuck/posts/10102593740125791'),
    expectedPost
  );
  t.deepEqual(
    parseInput('https://facebook.com/zuck/posts/10102593740125791'),
    expectedPost
  );
  t.deepEqual(
    parseInput('http://facebook.com/zuck/posts/10102593740125791'),
    expectedPost
  );
  t.deepEqual(parseInput('//facebook.com/zuck/posts/10102593740125791'), expectedPost);

  t.is(
    renderAndParse(expectedPost).url,
    expectedPost.url
  );

  const expectedPagePhoto = {
    type: 'facebook',
    embedAs: 'photo',
    user: 'rewire.news',
    url: 'https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738',
    id: '10152515593211738'
  };

  t.deepEqual(parseInput(photoCode), expectedPagePhoto);
  t.deepEqual(
    parseInput('https://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);
  t.deepEqual(
    parseInput('http://www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);
  t.deepEqual(
    parseInput('//www.facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);
  t.deepEqual(
    parseInput('https://facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);
  t.deepEqual(
    parseInput('http://facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);
  t.deepEqual(
    parseInput('//facebook.com/rewire.news/photos/a.102749171737.90216.9432926737/10152515593211738'),
    expectedPagePhoto);

  t.is(
    renderAndParse(expectedPagePhoto).url,
    expectedPagePhoto.url
  );

  const expectedPhoto = {
    type: 'facebook',
    embedAs: 'photo',
    url: 'https://www.facebook.com/photo.php?fbid=10103183415950711',
    id: '10103183415950711'
  };

  t.deepEqual(
    parseInput('https://www.facebook.com/photo.php?fbid=10103183415950711'),
    expectedPhoto);
  t.deepEqual(
    parseInput('http://www.facebook.com/photo.php?fbid=10103183415950711'),
    expectedPhoto);
  t.deepEqual(
    parseInput('//www.facebook.com/photo.php?fbid=10103183415950711'),
    expectedPhoto);
  t.deepEqual(
    parseInput('https://www.facebook.com/photo.php?fbid=10103183415950711&set=pcb.10103183428221121&type=3&theater'),
    expectedPhoto);

  t.is(
    renderAndParse(expectedPhoto).url,
    expectedPhoto.url
  );
});

test('youtube', t => {
  const youtubeCode = tsml`<iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/I7IdS-PbEgI"
    frameborder="0" allowfullscreen></iframe>`;

  const expected = {
    type: 'youtube',
    youtubeId: 'I7IdS-PbEgI',
    url: 'https://www.youtube.com/embed/I7IdS-PbEgI'
  };

  t.deepEqual(parseInput(youtubeCode), expected);
  t.deepEqual(parseInput('https://www.youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('http://www.youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('//www.youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('https://youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('http://youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('//youtube.com/embed/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('https://www.youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('http://www.youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('//www.youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('https://youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('http://youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('//youtube.com/watch?v=I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('https://youtu.be/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('http://youtu.be/I7IdS-PbEgI'), expected);
  t.deepEqual(parseInput('//youtu.be/I7IdS-PbEgI'), expected);

  t.is(
    renderAndParse(expected).youtubeId,
    expected.youtubeId
  );
});

test('twitter', t => {
  const twitterCode = tsml`
    <blockquote class="twitter-tweet" data-lang="en">
      <p lang="en" dir="ltr">High above <a href="
      https://twitter.com/hashtag/lapland?src=hash">#lapland</a> <a href="
      https://twitter.com/hashtag/AuroraBorealis?src=hash">#AuroraBorealis</a> <a href="
      https://twitter.com/ObservingSpace">@ObservingSpace</a> <a href="
      https://twitter.com/OurFinland">@OurFinland</a> <a href="
      https://twitter.com/OnlyInLapland">@OnlyInLapland</a> <a href="
      https://twitter.com/Kachelmann">@Kachelmann</a> <a href="
      https://t.co/1gdqsQxN1K">pic.twitter.com/1gdqsQxN1K</a></p>
      &mdash; Thomas Kast (@thomas_kast) <a href="
      https://twitter.com/thomas_kast/status/709353211455541248">March 14, 2016</a>
    </blockquote>
    <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`;

  const expected = {
    type: 'twitter',
    url: 'https://twitter.com/thomas_kast/status/709353211455541248',
    user: 'thomas_kast',
    id: '709353211455541248'
  };

  t.deepEqual(parseInput(twitterCode), expected);
  t.deepEqual(
    parseInput('https://twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );
  t.deepEqual(
    parseInput('http://twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );
  t.deepEqual(
    parseInput('//twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );
  t.deepEqual(
    parseInput('https://www.twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );
  t.deepEqual(
    parseInput('http://www.twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );
  t.deepEqual(
    parseInput('//www.twitter.com/thomas_kast/status/709353211455541248'),
    expected
  );

  t.is(
    renderAndParse(expected).url,
    expected.url
  );
});

test('tumblr', t => {
  const tumblrCode = tsml`
    <div class="tumblr-post"
      data-href="https://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/105825530041"
      data-did="da39a3ee5e6b4b0d3255bfef95601890afd80709">
      <a href="http://insane---world.tumblr.com/post/105825530041">
        http://insane---world.tumblr.com/post/105825530041
      </a>
    </div>
    <script async src="https://secure.assets.tumblr.com/post.js"></script>`;

  const expected = {
    type: 'tumblr',
    url: 'https://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/105825530041',
    id: '105825530041'
  };

  t.deepEqual(parseInput(tumblrCode), expected);
  t.deepEqual(
    parseInput('https://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/105825530041'),
    expected
  );
  t.deepEqual(
    parseInput('http://embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/105825530041'),
    expected
  );
  t.deepEqual(
    parseInput('//embed.tumblr.com/embed/post/Hj-X2tKsXur2oF91XMwT5w/105825530041'),
    expected
  );

  t.is(
    renderAndParse(expected).url,
    expected.url
  );
});

test('vine', t => {
  const vineCode = tsml`
    <iframe src="https://vine.co/v/iHTTDHz6Z2v/embed/simple"
      width="600"
      height="600"
      frameborder="0">
    </iframe>
    <script src="https://platform.vine.co/static/scripts/embed.js"></script>`;

  const expected = {
    type: 'vine',
    url: 'https://vine.co/v/iHTTDHz6Z2v/embed/simple',
    id: 'iHTTDHz6Z2v'
  };

  t.deepEqual(parseInput(vineCode), expected);
  t.deepEqual(parseInput('https://vine.co/v/iHTTDHz6Z2v'), expected);
  t.deepEqual(parseInput('https://vine.co/v/iHTTDHz6Z2v/embed'), expected);
  t.deepEqual(parseInput('https://vine.co/v/iHTTDHz6Z2v/embed/simple'), expected);
  t.deepEqual(parseInput('http://vine.co/v/iHTTDHz6Z2v'), expected);
  t.deepEqual(parseInput('http://vine.co/v/iHTTDHz6Z2v/embed'), expected);
  t.deepEqual(parseInput('http://vine.co/v/iHTTDHz6Z2v/embed/simple'), expected);
  t.deepEqual(parseInput('//vine.co/v/iHTTDHz6Z2v'), expected);
  t.deepEqual(parseInput('//vine.co/v/iHTTDHz6Z2v/embed'), expected);
  t.deepEqual(parseInput('//vine.co/v/iHTTDHz6Z2v/embed/simple'), expected);

  t.deepEqual(
    renderAndParse(expected),
    expected
  );
});

test('imgur', t => {
  const imgurCode = tsml`
    <blockquote class="imgur-embed-pub" lang="en" data-id="2GuAESk">
      <a href="//imgur.com/2GuAESk"> If this gets to front page I will draw a ton of imgur doodles for you guys</a>
    </blockquote>
    <script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>`;

  const expected = {
    type: 'imgur',
    url: 'https://imgur.com/2GuAESk',
    id: '2GuAESk'
  };

  t.deepEqual(parseInput(imgurCode), expected);
  t.deepEqual(parseInput('https://imgur.com/gallery/2GuAESk'), expected);
  t.deepEqual(parseInput('http://imgur.com/gallery/2GuAESk'), expected);
  t.deepEqual(parseInput('//imgur.com/gallery/2GuAESk'), expected);
  t.deepEqual(parseInput('https://imgur.com/2GuAESk'), expected);
  t.deepEqual(parseInput('http://imgur.com/2GuAESk'), expected);
  t.deepEqual(parseInput('//imgur.com/2GuAESk'), expected);
  t.deepEqual(parseInput('https://imgur.com/2GuAESk/embed'), expected);
  t.deepEqual(parseInput('http://imgur.com/2GuAESk/embed'), expected);
  t.deepEqual(parseInput('//imgur.com/2GuAESk/embed'), expected);
});

test('vimeo', t => {
  const vimeoCode = tsml`
    <iframe src="https://player.vimeo.com/video/35630244?color=ff002f"
      width="500"
      height="281"
      frameborder="0"
      webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    <p><a href="https://vimeo.com/35630244">Red Aurora Australis</a> from <a href="
      https://vimeo.com/terrastro">Alex Cherney</a> on <a href="
      https://vimeo.com">Vimeo</a>.</p>`;

  const expected = {
    type: 'vimeo',
    url: 'https://player.vimeo.com/video/35630244',
    id: '35630244'
  };

  t.deepEqual(parseInput(vimeoCode), expected);
  t.deepEqual(parseInput('https://player.vimeo.com/video/35630244'), expected);
  t.deepEqual(parseInput('http://player.vimeo.com/video/35630244'), expected);
  t.deepEqual(parseInput('//player.vimeo.com/video/35630244'), expected);
  t.deepEqual(parseInput('https://vimeo.com/35630244'), expected);
  t.deepEqual(parseInput('http://vimeo.com/35630244'), expected);
  t.deepEqual(parseInput('//vimeo.com/35630244'), expected);
});

test('graphiq', t => {
  const expected = {
    type: 'graphiq',
    url: 'https://w.graphiq.com/w/2iub6zz6ltH',
    id: '2iub6zz6ltH'
  };

  t.deepEqual(parseInput('https://graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('http://graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('//graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('https://www.graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('http://www.graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('//www.graphiq.com/wlp/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('https://w.graphiq.com/w/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('http://w.graphiq.com/w/2iub6zz6ltH'), expected);
  t.deepEqual(parseInput('//w.graphiq.com/w/2iub6zz6ltH'), expected);
});

test('facebook allow periods in username', t => {
  const expected = {
    type: 'facebook',
    embedAs: 'video',
    user: 'rick.morty',
    url: 'https://www.facebook.com/rick.morty/videos/1337',
    id: '1337'
  };
  const actual = parseInput('https://www.facebook.com/rick.morty/videos/1337');
  t.deepEqual(expected, actual);
});

test('twitter allow periods in username', t => {
  const expected = {
    type: 'twitter',
    url: 'https://twitter.com/rick.morty/status/42',
    user: 'rick.morty',
    id: '42'
  };
  const actual = parseInput('https://twitter.com/rick.morty/status/42');
  t.deepEqual(expected, actual);
});

test('acast', t => {
  const acastCode = tsml`
    <iframe width="540" height="540"
    src="https://embed.acast.com/specialrelationship/-1-terrorismandnationalsecurity"
    scrolling="no" frameborder="0" style="border:none;overflow:hidden;"></iframe>`;

  const expected = {
    type: 'acast',
    channel: 'specialrelationship',
    url: 'https://embed.acast.com/specialrelationship/-1-terrorismandnationalsecurity',
    name: '-1-terrorismandnationalsecurity',
    width: 540,
    height: 540
  };

  t.deepEqual(parseInput(acastCode), expected);
  t.deepEqual(parseInput('https://embed.acast.com/specialrelationship/-1-terrorismandnationalsecurity'), expected);
  t.deepEqual(parseInput('https://www.acast.com/specialrelationship/-1-terrorismandnationalsecurity'), expected);
});

test('scribd', t => {
  const scribdCode = tsml`
    <iframe class="scribd_iframe_embed"
    src="https://www.scribd.com/embeds/320741042/content?start_page=1&view_mode=scroll&access_key=key-1mpoU4LMiQy0sf1mx8pe&show_recommendations=false"
    data-auto-height="false"
    data-aspect-ratio="0.7729220222793488"
    scrolling="no" id="doc_61832" width="600" height="800" frameborder="0"></iframe>`;

  const expected = {
    type: 'scribd',
    id: '320741042',
    url: 'https://www.scribd.com/embeds/320741042/content'
  };

  t.deepEqual(parseInput(scribdCode), expected);
  t.deepEqual(parseInput('https://www.scribd.com/embeds/320741042/content'), expected);

  const scribdCodeDocument = tsml`
    <iframe class="scribd_iframe_embed"
    src="https://www.scribd.com/document/320741042/Mike-Crapo-Missing-Poster-2-10-2017?start_page=1&view_mode=scroll&access_key=key-1mpoU4LMiQy0sf1mx8pe&show_recommendations=false"
    data-auto-height="false"
    data-aspect-ratio="0.7729220222793488"
    scrolling="no" id="doc_61832" width="600" height="800" frameborder="0"></iframe>`;

  const expectedDocument = {
    type: 'scribd',
    id: '320741042',
    url: 'https://www.scribd.com/embeds/320741042/content'
  };

  t.deepEqual(parseInput(scribdCodeDocument), expectedDocument);
  t.deepEqual(parseInput('https://www.scribd.com/document/320741042/Mike-Crapo-Missing-Poster-2-10-2017'), expected);
});

test('spotify', t => {
  t.deepEqual(
    parseInput('https://open.spotify.com/artist/6kBDZFXuLrZgHnvmPu9NsG'),
    {
      type: 'spotify',
      url: 'https://embed.spotify.com/?uri=spotify:artist:6kBDZFXuLrZgHnvmPu9NsG'
    }
  );

  t.deepEqual(
    parseInput('https://open.spotify.com/track/6sEz1Cd0HVXRXuvIw9zAmK'),
    {
      type: 'spotify',
      url: 'https://embed.spotify.com/?uri=spotify:track:6sEz1Cd0HVXRXuvIw9zAmK'
    }
  );

  t.deepEqual(
    parseInput('https://open.spotify.com/user/hamiltonmusical/playlist/4Rf5kHoohcqAS5Qc6gglaX'),
    {
      type: 'spotify',
      url: 'https://embed.spotify.com/?uri=spotify:user:hamiltonmusical:playlist:4Rf5kHoohcqAS5Qc6gglaX'
    }
  );
});
