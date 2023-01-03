#!/usr/bin/env node

const { default: run } = require('../lib/index');

console.log('Running......');

run()
  .then(() => 'Successful')
  .catch(e => console.error('Failed:', e));
