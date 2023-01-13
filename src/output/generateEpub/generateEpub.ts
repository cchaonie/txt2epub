import { Epub } from "../../core";

import { GenerateEpubOptions } from "./types";

export default async function generateEpub({
  title,
  author,
  content,
  outputDir,
}: GenerateEpubOptions) {
  const options = {
    title,
    lang: "zh",
    cover: "",
    tocTitle: title,
    appendChapterTitles: false,
    author,
    content,
    output: `${outputDir}/${title}.epub`,
    publisher: "",
    verbose: true,
  };

  try {
    await new Epub(options).promise;
    console.log("Ebook Generated Successfully!");
  } catch (error) {
    console.error("Failed to generate Ebook because of ", error);
  }
}
