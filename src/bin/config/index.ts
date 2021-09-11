/* eslint-disable import/first */
console.clear();
import { config } from 'dotenv';
import aliases from 'require-aliases';

function configure() {
  config();
  aliases({ src: 'tsconfig.json', from: 'compilerOptions.paths', baseSrc: 'compilerOptions.baseUrl' });
}

export { configure };
