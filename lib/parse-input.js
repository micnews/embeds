const allowed = [
  [/(https?:)?\/\/(www\.)?instagram\.com\/p\/([\w.-]+)/, match => {
    const id = match[3];
    return {
      type: 'instagram',
      text: '',
      url: `https://www.instagram.com/p/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?giphy\.com\/embed\/([\w.-]+)/, match => {
    const id = match[3];
    return {
      type: 'giphy',
      text: '',
      url: `https://giphy.com/embed/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?giphy\.com\/gifs\/(?:.*-)?([^ \/]+)/, match => {
    const id = match[3];
    return {
      type: 'giphy',
      text: '',
      url: `https://giphy.com/embed/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?facebook\.com\/([\w.-]+)\/(videos|posts)\/([0-9]+)/, match => {
    const user = match[3];
    const type = match[4];
    const id = match[5];
    const embedAs = type === 'videos' ? 'video' : 'post';
    return {
      type: 'facebook',
      embedAs: embedAs,
      user: user,
      url: `https://www.facebook.com/${user}/${type}/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?facebook\.com\/([\w.-]+)\/(photos)\/([\w.-]+)\/([0-9]+)/, match => {
    const user = match[3];
    const albumId = match[5];
    const id = match[6];
    return {
      type: 'facebook',
      embedAs: 'photo',
      user: user,
      url: `https://www.facebook.com/${user}/photos/${albumId}/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?facebook\.com\/(?:photo\.php\?fbid=)?([0-9]*)/, match => {
    const id = match[3];
    return {
      type: 'facebook',
      embedAs: 'photo',
      url: `https://www.facebook.com/photo.php?fbid=${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?twitter\.com\/([\w.-]+)\/status\/([0-9]+)/, match => {
    const user = match[3];
    const id = match[4];
    return {
      type: 'twitter',
      user: user,
      url: `https://twitter.com/${user}/status/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?youtube\.com\/(embed\/|watch\?v=)([\w.-]+)/, match => {
    const id = match[4];
    return {
      type: 'youtube',
      youtubeId: id,
      url: `https://www.youtube.com/embed/${id}`
    };
  }],
  [/(https?:)?\/\/(www\.)?youtu\.be\/([\w.-]+)/, match => {
    const id = match[3];
    return {
      type: 'youtube',
      youtubeId: id,
      url: `https://www.youtube.com/embed/${id}`
    };
  }],
  [/(https?:)?\/\/embed\.tumblr\.com\/embed\/post\/([\w.-]+)\/([0-9]+)/, match => {
    const key = match[2];
    const id = match[3];
    return {
      type: 'tumblr',
      url: `https://embed.tumblr.com/embed/post/${key}/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?vine\.co\/v\/([\w.-]+)/, match => {
    const id = match[3];
    return {
      type: 'vine',
      url: `https://vine.co/v/${id}/embed/simple`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.)?imgur\.com\/(gallery\/)?([\w.-]+)/, match => {
    const id = match[4];
    return {
      type: 'imgur',
      url: `https://imgur.com/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(www\.|w\.)?graphiq\.com\/(wlp|w)\/([\w.-]+)/, match => {
    const id = match[4];
    return {
      type: 'graphiq',
      url: `https://w.graphiq.com/w/${id}`,
      id: id
    };
  }],
  [/(https?:)?\/\/(player\.)?vimeo\.com\/(video\/)?([0-9]+)/, match => {
    const id = match[4];
    return {
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${id}`,
      id: id
    };
  }],
  [/https:\/\/(embed|www)\.acast\.com\/([\w.-]+)\/([\w.-]+)/, match => {
    const channel = match[2];
    const name = match[3];
    return {
      type: 'acast',
      channel,
      name,
      url: `https://embed.acast.com/${channel}/${name}`,
      width: 540,
      height: 540
    };
  }],
  [/https:\/\/www\.scribd\.com\/(embeds|document)\/([0-9]+)\/.+/, match => {
    const id = match[2];
    return {
      type: 'scribd',
      id,
      url: `https://www.scribd.com/embeds/${id}/content`
    };
  }],
  [/https:\/\/open.spotify.com\/(.+)/, match => {
    const uri = match[1].replace(/\//g, ':');
    return {
      type: 'spotify',
      url: `https://embed.spotify.com/?uri=spotify:${uri}`
    };
  }]
];

export default function (url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  for (let i = 0; i < allowed.length; ++i) {
    const [regex, fn] = allowed[i];
    const match = url.match(regex);
    if (!match) {
      continue;
    }

    return fn(match);
  }

  return null;
}
