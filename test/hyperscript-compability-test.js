import test from './tape-wrapper';

test('hyperscript + embeds compability', t => {
  t.notThrows(function () {
    require('hyperscript');
    require('./../lib');
  });
});
