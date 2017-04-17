import test from './tape-wrapper';

test('hyperscript + embeds compability', t => {
  t.doesNotThrow(function () {
    require('hyperscript');
    require('./../lib');
  });
});
