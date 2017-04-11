const fs = require('fs');

export default {
  instagramCaption: fs.readFileSync(`${__dirname}/instagram.html`, 'utf8').trim(),
  instagramWithoutCaption:
    fs.readFileSync(`${__dirname}/instagram-no-caption.html`, 'utf8').trim(),
  facebookPost: fs.readFileSync(`${__dirname}/facebook-post.html`, 'utf8').trim(),
  facebookPostInvalid: fs.readFileSync(`${__dirname}/facebook-post-invalid.html`, 'utf8').trim(),
  facebookVideo: fs.readFileSync(`${__dirname}/facebook-video.html`, 'utf8').trim(),
  facebookPhoto: fs.readFileSync(`${__dirname}/facebook-photo.html`, 'utf8').trim(),
  facebookEmbedCode: fs.readFileSync(`${__dirname}/facebook-embed-code.html`, 'utf8').trim(),
  tweetNoUser: fs.readFileSync(`${__dirname}/tweet-no-user.html`, 'utf8').trim(),
  tweetVideo: fs.readFileSync(`${__dirname}/tweet-video.html`, 'utf8').trim(),
  tumblrPost: fs.readFileSync(`${__dirname}/tumblr-post.html`, 'utf8').trim(),
  tidalVideo: fs.readFileSync(`${__dirname}/tidal-video.html`, 'utf8').trim()
};
