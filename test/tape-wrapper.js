import test from 'tapava';

if (process.browser) {
  test.onFinish(global.close);
}

export default test;
