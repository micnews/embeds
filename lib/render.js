import types from './types';

export default opts => (types[opts.type] ? types[opts.type].render(opts) : '');
