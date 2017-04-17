import test from 'tape-catch';

if (process.browser) {
  test.onFinish(global.close);
}

export default (msg, cb) => {
  test(msg, (t) => {
    cb(t);
    t.end();
  });
};
