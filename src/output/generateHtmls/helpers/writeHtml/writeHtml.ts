import fs from 'fs/promises';
import path from 'path';

export default async function writeHtml(
  outputDir: string,
  content: string,
  filename: string
) {
  const fileHandle = await fs.open(
    path.resolve(outputDir, `${filename}.html`),
    'w'
  );

  await fileHandle.writeFile(content);
  await fileHandle.close();
}
