import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';

const insertAt = (arr: any, index: number, item: any) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index),
];

const main = async () => {
  const execAsync = promisify(exec);

  // Remove dist folder if exists
  await fs.rm('dist', { recursive: true });

  // Build the project
  await execAsync('tsc -p tsconfig.json');

  // Copy types to dist
  await fs.copyFile('src/index.d.ts', 'dist/index.d.ts');
};

main();
