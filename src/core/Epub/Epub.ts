/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
import path from 'path';
import fs from 'fs';
import { isEmpty, isString, isArray, extend, each, map } from 'underscore';
import { load, Element } from 'cheerio';
import { encodeXML } from 'entities';
import mime from 'mime';
import archiver from 'archiver';
import rimraf from 'rimraf';
import fsExtra from 'fs-extra';
import { nanoid } from 'nanoid';

import { EpubOptions, Options } from './types';
import { getTableOfContent, renderTemplate } from './helpers';
import { ALLOWED_ATTRIBUTES, DEFAULT_OPTIONS } from './constants';

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
    this.options.images = [];
    this.options.content = map(
      customOptions.content,
      ({ title, data, author, type }, index) => {
        const href = `${index}_${title}.xhtml`;
        const filePath = path.resolve(
          this.uuid,
          `./OEBPS/${index}_${title}.xhtml`
        );

        const id = `item_${index}`;
        const dir = path.dirname(filePath);

        let $ = load(data, {
          lowerCaseTags: true,
          recognizeSelfClosing: true,
        });

        if ($('body').length) {
          $ = load($('body').html(), {
            lowerCaseTags: true,
            recognizeSelfClosing: true,
          });
        }

        $($('*').get().reverse()).each((_, elem) => {
          const currentElement = elem as unknown as Element;
          const attrs = currentElement.attribs;
          const ref = currentElement.name;
          if (ref === 'img' || ref === 'br' || ref === 'hr') {
            if (ref === 'img') {
              $(currentElement).attr(
                'alt',
                $(currentElement).attr('alt') || 'image-placeholder'
              );
            }
          }
          for (const k in attrs) {
            if (ALLOWED_ATTRIBUTES.indexOf(k) >= 0) {
              if (k === 'type') {
                if (currentElement.name !== 'script') {
                  $(currentElement).removeAttr(k);
                }
              }
            } else {
              $(currentElement).removeAttr(k);
            }
          }
        });

        $('img').each((_, elem) => {
          let extension = '';
          let id = '';
          const url = $(elem).attr('src');
          const image = this.options.images.find((element) => {
            return element.url === url;
          });
          if (image) {
            id = image.id;
            extension = image.extension;
          } else {
            id = nanoid();
            const mediaType = mime.getType(url.replace(/\?.*/, ''));
            extension = mime.getExtension(mediaType);
            this.options.images.push({ id, url, dir, mediaType, extension });
          }
          $(elem).attr('src', `images/${id}.${extension}`);
        });

        return {
          id,
          title,
          href,
          author: author ? [author] : undefined,
          data: $.xml(),
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
    }
  }

  async render() {
    try {
      await this.generateTempFile();
      await this.makeCover();
      await this.genEpub();
      console.log('Done.');
    } catch (error) {
      console.error('Something wrong happened: ', error);
      throw error;
    }
  }

  generateTempFile() {
    if (this.options.verbose) {
      console.log('Generating Template Files.....');
    }
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
        this.options.fonts = map(this.options.fonts, function (font) {
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
        const { title, author, url, data: pageData, filePath } = pageContent;
        let data = `${
          this.options.docHeader
        }\n  <head>\n  <meta charset="UTF-8" />\n  <title>${encodeXML(
          title || ''
        )}</title>\n  <link rel="stylesheet" type="text/css" href="style.css" />\n  </head>\n<body>`;
        data +=
          title && this.options.appendChapterTitles
            ? `<h1>${encodeXML(title)}</h1>`
            : '';
        data += author?.length
          ? `<p class='epub-author'>${encodeXML(author.join(', '))}</p>`
          : '';
        data += url
          ? `<p class='epub-link'><a href='${url}'>${url}</a></p>`
          : '';
        data += `${pageData}</body></html>`;

        return fs.writeFileSync(filePath, data);
      });
      // write meta-inf/container.xml
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
      ]).then(
        ([data1, data2, data3]) => {
          fs.writeFileSync(
            path.resolve(this.uuid, './OEBPS/content.opf'),
            data1
          );
          fs.writeFileSync(path.resolve(this.uuid, './OEBPS/toc.ncx'), data2);
          fs.writeFileSync(path.resolve(this.uuid, './OEBPS/toc.xhtml'), data3);
          return resolve('SUCCESS');
        },
        (err) => {
          console.error(err);
          return err;
        }
      );
    });
  }

  makeCover() {
    if (this.options.verbose) {
      console.log('Making Cover...');
    }
    return new Promise((resolve, reject) => {
      if (this.options.cover) {
        const destPath = path.resolve(
          this.uuid,
          './OEBPS/cover.' + this.options._coverExtension
        );
        const writeStream = fs.createReadStream(this.options.cover);
        writeStream.pipe(fs.createWriteStream(destPath));
        writeStream.on('end', function () {
          if (this.options.verbose) {
            console.log('[Success] cover image downloaded successfully!');
          }
          return resolve('SUCCESS');
        });
        writeStream.on('error', function (err) {
          console.error('Error', err);
          return reject(err);
        });
      } else {
        resolve('SUCCESS');
      }
    });
  }

  genEpub() {
    if (this.options.verbose) {
      console.log('Generating Epub Files...');
    }
    return new Promise((resolve, reject) => {
      const cwd = this.uuid;
      const archive = archiver('zip', {
        zlib: {
          level: 9,
        },
      });
      const output = fs.createWriteStream(this.options.output);
      if (this.options.verbose) {
        console.log('Zipping temp dir to', this.options.output);
      }
      archive.append('application/epub+zip', {
        store: true,
        name: 'mimetype',
      });
      archive.directory(cwd + '/META-INF', 'META-INF');
      archive.directory(cwd + '/OEBPS', 'OEBPS');
      archive.pipe(output);
      archive.on('end', () => {
        if (this.options.verbose) {
          console.log('Done zipping, clearing temp dir...');
        }
        return rimraf(cwd, { preserveRoot: false }, (err) => {
          if (err) {
            return reject(err);
          } else {
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
