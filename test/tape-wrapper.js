/* eslint-disable import/no-extraneous-dependencies */

import test from 'tape-catch';

export default (msg, cb) => {
  test(msg, (t) => {
    cb(t);
    t.end();
  });
};
