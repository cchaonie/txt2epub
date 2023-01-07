import { writeHtml } from './helpers';
import { GenerateHtmlsOptions } from './types';

export default async ({ outputDir, content }: GenerateHtmlsOptions) => {
  let outputContent: string[];

  if (!Array.isArray(content)) {
    outputContent = [content];
  } else {
    outputContent = content;
  }

  await Promise.all(
    outputContent.map((content, i) =>
      writeHtml(outputDir, content, `page_${i + 1}`)
    )
  );
};
