import path from 'path';
import fs from 'fs';
import { isEmpty, extend, each, map } from 'underscore';
import { encodeXML } from 'entities';
import mime from 'mime';
import archiver from 'archiver';
import rimraf from 'rimraf';
import fsExtra from 'fs-extra';
import { nanoid } from 'nanoid';

import { getTableOfContent, renderTemplate } from './helpers';
import { DEFAULT_OPTIONS } from './constants';
import { EpubOptions, Options } from './types';
import { PageType } from '../../parse/parseTxt/constants';

export default class Epub {
  options: EpubOptions;
  id: string;
  uuid: string;

  constructor(customOptions: Options) {
    this.options = extend(
      { description: customOptions.title },
      DEFAULT_OPTIONS,
      customOptions
    );

    if (!this.options.output) {
      console.error(new Error('No Output Path'));
      return;
    }

    if (!customOptions.title || !customOptions.content) {
      console.error(new Error('Title and content are both required'));
      return;
    }

    this.options.docHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${this.options.lang}">`;

    if (isEmpty(this.options.author)) {
      this.options.author = ['anonymous'];
    }

    if (!this.options.tempDir) {
      this.options.tempDir = path.resolve(__dirname, '../tempDir/');
    }

    this.id = nanoid();
    this.uuid = path.resolve(this.options.tempDir, this.id);
    this.options.uuid = this.uuid;
    this.options.id = this.id;
    this.options.content = map(
      customOptions.content,
      ({ title, data, type }, index) => {
        const href = `./${index}_${title}.xhtml`;
        const filePath = path.resolve(
          this.uuid,
          `./OEBPS/${index}_${title}.xhtml`
        );

        const id = `item_${index}`;
        const dir = path.dirname(filePath);

        return {
          id,
          title,
          href,
          author: customOptions.author,
          data,
          dir,
          type,
          filePath,
        };
      }
    );

    if (this.options.cover) {
      this.options._coverMediaType = mime.getType(this.options.cover);
      this.options._coverExtension = mime.getExtension(
        this.options._coverMediaType
      );
      const id = 'Cover';
      const filename = `${id}.xhtml`;
      const filePath = path.resolve(this.uuid, `./OEBPS/${filename}`);

      this.options.content.unshift({
        title: '封面',
        data: `<div class='Cover'><img role='doc-cover'  src='./cover.${this.options._coverExtension}' /></div>`,
        filePath,
        type: PageType.Other,
        href: `./${filename}`,
        id,
        beforeToc: true,
      });
    }
  }

  async render() {
    await this.generateTempFile();

    if (this.options.cover) {
      await this.makeCover();
    }

    await this.emitEpub();
  }

  generateTempFile() {
    console.log('Generating Template Files.....');
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(this.options.tempDir)) {
        fs.mkdirSync(this.options.tempDir);
      }

      fs.mkdirSync(this.uuid);
      fs.mkdirSync(path.resolve(this.uuid, './OEBPS'));

      if (!this.options.css) {
        this.options.css = fs.readFileSync(
          path.resolve(__dirname, '../templates/template.css'),
          { encoding: 'utf-8' }
        );
      }

      fs.writeFileSync(
        path.resolve(this.uuid, './OEBPS/style.css'),
        this.options.css
      );

      if (this.options.fonts.length) {
        fs.mkdirSync(path.resolve(this.uuid, './OEBPS/fonts'));

        this.options.fonts = map(this.options.fonts, (font) => {
          if (!fs.existsSync(font)) {
            reject(new Error('Custom font not found at ' + font + '.'));
          }
          const filename = path.basename(font);
          fsExtra.copySync(
            font,
            path.resolve(this.uuid, './OEBPS/fonts/' + filename)
          );
          return filename;
        });
      }

      each(this.options.content, (pageContent) => {
        const { title, data: pageData, filePath, id } = pageContent;

        let data = `${
          this.options.docHeader
        }\n  <head>\n  <meta charset="UTF-8" />\n  <title>${encodeXML(
          title || ''
        )}</title>\n  <link rel="stylesheet" type="text/css" href="style.css" />\n  </head>\n<body ${
          id === 'Cover' ? 'epub:type="cover"' : undefined
        }>`;
        data += `${pageData}</body></html>`;

        return fs.writeFileSync(filePath, data);
      });

      fs.mkdirSync(this.uuid + '/META-INF');
      fs.writeFileSync(
        `${this.uuid}/META-INF/container.xml`,
        '<?xml version="1.0" encoding="UTF-8" ?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
      );

      const opfPath =
        this.options.customOpfTemplatePath ||
        path.resolve(__dirname, `../templates/epub3/content.opf.ejs`);
      if (!fs.existsSync(opfPath)) {
        reject(new Error('Custom file to OPF template not found.'));
      }

      const ncxTocPath =
        this.options.customNcxTocTemplatePath ||
        path.resolve(__dirname, '../templates/toc.ncx.ejs');
      if (!fs.existsSync(ncxTocPath)) {
        reject(new Error('Custom file the NCX toc template not found.'));
      }

      const htmlTocPath =
        this.options.customHtmlTocTemplatePath ||
        path.resolve(__dirname, `../templates/epub3/toc.xhtml.ejs`);
      if (!fs.existsSync(htmlTocPath)) {
        reject(new Error('Custom file to HTML toc template not found.'));
      }

      const tableOfContents = getTableOfContent(this.options);

      Promise.all([
        renderTemplate(opfPath, this.options),
        renderTemplate(ncxTocPath, tableOfContents),
        renderTemplate(htmlTocPath, tableOfContents),
      ]).then(([data1, data2, data3]) => {
        fs.writeFileSync(path.resolve(this.uuid, './OEBPS/content.opf'), data1);
        fs.writeFileSync(path.resolve(this.uuid, './OEBPS/toc.ncx'), data2);
        fs.writeFileSync(path.resolve(this.uuid, './OEBPS/toc.xhtml'), data3);
        return resolve('SUCCESS');
      });
    });
  }

  makeCover() {
    console.log('Making Cover...');
    return new Promise((resolve, reject) => {
      const destPath = path.resolve(
        this.uuid,
        './OEBPS/cover.' + this.options._coverExtension
      );
      const writeStream = fs.createReadStream(this.options.cover);
      writeStream.pipe(fs.createWriteStream(destPath));
      writeStream.on('end', () => {
        console.log('[Success] cover image generated successfully!');
        return resolve('SUCCESS');
      });
      writeStream.on('error', (err) => {
        console.error('Error', err);
        return reject(err);
      });
    });
  }

  emitEpub() {
    console.log('Generating Epub Files...');
    return new Promise((resolve, reject) => {
      const cwd = this.uuid;
      const archive = archiver('zip', {
        zlib: {
          level: 9,
        },
      });
      const output = fs.createWriteStream(this.options.output);
      console.log('Zipping temp dir to', this.options.output);
      archive.append('application/epub+zip', {
        store: true,
        name: 'mimetype',
      });
      archive.directory(cwd + '/META-INF', 'META-INF');
      archive.directory(cwd + '/OEBPS', 'OEBPS');
      archive.pipe(output);
      archive.on('end', () => {
        console.log('Done zipping, clearing temp dir...');
        return rimraf(this.options.tempDir, { preserveRoot: false }, (err) => {
          if (err) {
            return reject(err);
          } else {
            console.log('Done clearing temp dir.');
            return resolve('SUCCESS');
          }
        });
      });
      archive.on('error', (err) => {
        return reject(err);
      });
      archive.finalize();
    });
  }
}
