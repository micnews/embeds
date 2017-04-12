/* eslint-disable */
import test from './tape-wrapper';

test('hyperscript + embeds compability', t => {
  t.doesNotThrow(() => {
    require('hyperscript');
    require('./../lib');
  });
});
