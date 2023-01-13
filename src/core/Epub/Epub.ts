/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
const indexOf = [].indexOf;
import path from 'path';
import fs from 'fs';
import Q from 'q';
import { isEmpty, isString, isArray, extend, each, map } from 'underscore';
import uslug from 'uslug';
import ejs from 'ejs';
import { load } from 'cheerio';
import { encodeXML } from 'entities';
import mime from 'mime';
import archiver from 'archiver';
import rimraf from 'rimraf';
import fsextra from 'fs-extra';
import { remove } from 'diacritics';
import { EpubOptions, Options } from './types';

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

export default class Epub {
  options: EpubOptions;
  id: string;
  uuid: string;

  constructor(options: Options) {
    if (!this.options.output) {
      console.error(new Error('No Output Path'));
      Promise.reject(new Error('No output path'));
      return;
    }
    if (!options.title || !options.content) {
      console.error(new Error('Title and content are both required'));
      Promise.reject(new Error('Title and content are both required'));
      return;
    }
    this.options = extend(
      {
        description: options.title,
        publisher: 'anonymous',
        author: ['anonymous'],
        tocTitle: 'Table Of Contents',
        appendChapterTitles: true,
        date: new Date().toISOString(),
        lang: 'en',
        fonts: [],
        customOpfTemplatePath: null,
        customNcxTocTemplatePath: null,
        customHtmlTocTemplatePath: null,
        version: 3,
      },
      options
    );

    this.options.docHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${this.options.lang}">`;

    if (isEmpty(this.options.author)) {
      this.options.author = ['anonymous'];
    }
    if (!this.options.tempDir) {
      this.options.tempDir = path.resolve(__dirname, '../tempDir/');
    }
    this.id = uuid();
    this.uuid = path.resolve(this.options.tempDir, this.id);
    this.options.uuid = this.uuid;
    this.options.id = this.id;
    this.options.images = [];
    this.options.content = map(this.options.content, (content, index) => {
      let $, titleSlug;
      if (!content.filename) {
        titleSlug = uslug(remove(content.title || 'no title'));
        content.href = `${index}_${titleSlug}.xhtml`;
        content.filePath = path.resolve(
          this.uuid,
          `./OEBPS/${index}_${titleSlug}.xhtml`
        );
      } else {
        content.href = content.filename.match(/\.xhtml$/)
          ? content.filename
          : `${content.filename}.xhtml`;
        if (content.filename.match(/\.xhtml$/)) {
          content.filePath = path.resolve(
            this.uuid,
            `./OEBPS/${content.filename}`
          );
        } else {
          content.filePath = path.resolve(
            this.uuid,
            `./OEBPS/${content.filename}.xhtml`
          );
        }
      }
      content.id = `item_${index}`;
      content.dir = path.dirname(content.filePath);
      content.excludeFromToc || (content.excludeFromToc = false);
      content.beforeToc || (content.beforeToc = false);

      content.author =
        content.author && isString(content.author)
          ? [content.author]
          : !content.author || !isArray(content.author)
          ? []
          : content.author;

      const allowedAttributes = [
        'content',
        'alt',
        'id',
        'title',
        'src',
        'href',
        'about',
        'accesskey',
        'aria-activedescendant',
        'aria-atomic',
        'aria-autocomplete',
        'aria-busy',
        'aria-checked',
        'aria-controls',
        'aria-describedat',
        'aria-describedby',
        'aria-disabled',
        'aria-dropeffect',
        'aria-expanded',
        'aria-flowto',
        'aria-grabbed',
        'aria-haspopup',
        'aria-hidden',
        'aria-invalid',
        'aria-label',
        'aria-labelledby',
        'aria-level',
        'aria-live',
        'aria-multiline',
        'aria-multiselectable',
        'aria-orientation',
        'aria-owns',
        'aria-posinset',
        'aria-pressed',
        'aria-readonly',
        'aria-relevant',
        'aria-required',
        'aria-selected',
        'aria-setsize',
        'aria-sort',
        'aria-valuemax',
        'aria-valuemin',
        'aria-valuenow',
        'aria-valuetext',
        'class',
        'content',
        'contenteditable',
        'contextmenu',
        'datatype',
        'dir',
        'draggable',
        'dropzone',
        'hidden',
        'hreflang',
        'id',
        'inlist',
        'itemid',
        'itemref',
        'itemscope',
        'itemtype',
        'lang',
        'media',
        'ns1:type',
        'ns2:alphabet',
        'ns2:ph',
        'onabort',
        'onblur',
        'oncanplay',
        'oncanplaythrough',
        'onchange',
        'onclick',
        'oncontextmenu',
        'ondblclick',
        'ondrag',
        'ondragend',
        'ondragenter',
        'ondragleave',
        'ondragover',
        'ondragstart',
        'ondrop',
        'ondurationchange',
        'onemptied',
        'onended',
        'onerror',
        'onfocus',
        'oninput',
        'oninvalid',
        'onkeydown',
        'onkeypress',
        'onkeyup',
        'onload',
        'onloadeddata',
        'onloadedmetadata',
        'onloadstart',
        'onmousedown',
        'onmousemove',
        'onmouseout',
        'onmouseover',
        'onmouseup',
        'onmousewheel',
        'onpause',
        'onplay',
        'onplaying',
        'onprogress',
        'onratechange',
        'onreadystatechange',
        'onreset',
        'onscroll',
        'onseeked',
        'onseeking',
        'onselect',
        'onshow',
        'onstalled',
        'onsubmit',
        'onsuspend',
        'ontimeupdate',
        'onvolumechange',
        'onwaiting',
        'prefix',
        'property',
        'rel',
        'resource',
        'rev',
        'role',
        'spellcheck',
        'style',
        'tabindex',
        'target',
        'title',
        'type',
        'typeof',
        'vocab',
        'xml:base',
        'xml:lang',
        'xml:space',
        'colspan',
        'rowspan',
        'epub:type',
        'epub:prefix',
      ];
      $ = load(content.data, {
        lowerCaseTags: true,
        recognizeSelfClosing: true,
      });
      // Only body innerHTML is allowed
      if ($('body').length) {
        $ = load($('body').html(), {
          lowerCaseTags: true,
          recognizeSelfClosing: true,
        });
      }
      $($('*').get().reverse()).each(function (elemIndex, elem) {
        let attrs, k, ref, that;
        attrs = elem.attribs;
        that = this;
        if ((ref = that.name) === 'img' || ref === 'br' || ref === 'hr') {
          if (that.name === 'img') {
            $(that).attr('alt', $(that).attr('alt') || 'image-placeholder');
          }
        }
        for (k in attrs) {
          if (indexOf.call(allowedAttributes, k) >= 0) {
            if (k === 'type') {
              if (that.name !== 'script') {
                $(that).removeAttr(k);
              }
            }
          } else {
            $(that).removeAttr(k);
          }
        }
      });
      $('img').each((index, elem) => {
        let dir, extension, id, image, mediaType, url;
        url = $(elem).attr('src');
        if (
          (image = this.options.images.find((element) => {
            return element.url === url;
          }))
        ) {
          id = image.id;
          extension = image.extension;
        } else {
          id = uuid();
          mediaType = mime.getType(url.replace(/\?.*/, ''));
          extension = mime.getExtension(mediaType);
          dir = content.dir;
          this.options.images.push({ id, url, dir, mediaType, extension });
        }
        return $(elem).attr('src', `images/${id}.${extension}`);
      });
      content.data = $.xml();
      return content;
    });
    if (this.options.cover) {
      this.options._coverMediaType = mime.getType(this.options.cover);
      this.options._coverExtension = mime.getExtension(
        this.options._coverMediaType
      );
    }
  }

  render() {
    if (this.options.verbose) {
      console.log('Generating Template Files.....');
    }
    return this.generateTempFile().then(
      () => {
        if (this.options.verbose) {
          console.log('Making Cover...');
        }
        return this.makeCover().then(
          () => {
            if (this.options.verbose) {
              console.log('Generating Epub Files...');
            }
            return this.genEpub().then(
              () => {
                if (this.options.verbose) {
                  console.log('About to finish...');
                }
                if (this.options.verbose) {
                  return console.log('Done.');
                }
              },
              (err) => {
                console.error(err);
                return err;
              }
            );
          },
          (err) => {
            console.error(err);
            return err;
          }
        );
      },
      (err) => {
        console.error(err);
        return err;
      }
    );
  }

  generateTempFile() {
    return new Promise((resolve, reject) => {
      let base, htmlTocPath, ncxTocPath, opfPath;
      if (!fs.existsSync(this.options.tempDir)) {
        fs.mkdirSync(this.options.tempDir);
      }
      fs.mkdirSync(this.uuid);
      fs.mkdirSync(path.resolve(this.uuid, './OEBPS'));
      (base = this.options).css ||
        (base.css = fs.readFileSync(
          path.resolve(__dirname, '../templates/template.css')
        ));
      fs.writeFileSync(
        path.resolve(this.uuid, './OEBPS/style.css'),
        this.options.css
      );
      if (this.options.fonts.length) {
        fs.mkdirSync(path.resolve(this.uuid, './OEBPS/fonts'));
        this.options.fonts = map(this.options.fonts, function (font) {
          let filename;
          if (!fs.existsSync(font)) {
            reject(new Error('Custom font not found at ' + font + '.'));
          }
          filename = path.basename(font);
          fsextra.copySync(
            font,
            path.resolve(this.uuid, './OEBPS/fonts/' + filename)
          );
          return filename;
        });
      }
      each(this.options.content, function (content) {
        let data = `${
          this.options.docHeader
        }\n  <head>\n  <meta charset="UTF-8" />\n  <title>${encodeXML(
          content.title || ''
        )}</title>\n  <link rel="stylesheet" type="text/css" href="style.css" />\n  </head>\n<body>`;
        data +=
          content.title && this.options.appendChapterTitles
            ? `<h1>${encodeXML(content.title)}</h1>`
            : '';
        data +=
          content.title && content.author && content.author.length
            ? `<p class='epub-author'>${encodeXML(
                content.author.join(', ')
              )}</p>`
            : '';
        data +=
          content.title && content.url
            ? `<p class='epub-link'><a href='${content.url}'>${content.url}</a></p>`
            : '';
        data += `${content.data}</body></html>`;
        return fs.writeFileSync(content.filePath, data);
      });
      // write meta-inf/container.xml
      fs.mkdirSync(this.uuid + '/META-INF');
      fs.writeFileSync(
        `${this.uuid}/META-INF/container.xml`,
        '<?xml version="1.0" encoding="UTF-8" ?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
      );
      opfPath =
        this.options.customOpfTemplatePath ||
        path.resolve(
          __dirname,
          `../templates/epub${this.options.version}/content.opf.ejs`
        );
      if (!fs.existsSync(opfPath)) {
        reject(new Error('Custom file to OPF template not found.'));
      }
      ncxTocPath =
        this.options.customNcxTocTemplatePath ||
        path.resolve(__dirname, '../templates/toc.ncx.ejs');
      if (!fs.existsSync(ncxTocPath)) {
        reject(new Error('Custom file the NCX toc template not found.'));
      }
      htmlTocPath =
        this.options.customHtmlTocTemplatePath ||
        path.resolve(
          __dirname,
          `../templates/epub${this.options.version}/toc.xhtml.ejs`
        );
      if (!fs.existsSync(htmlTocPath)) {
        reject(new Error('Custom file to HTML toc template not found.'));
      }
      Q.all([
        Q.nfcall(ejs.renderFile, opfPath, this.options),
        Q.nfcall(ejs.renderFile, ncxTocPath, this.options),
        Q.nfcall(ejs.renderFile, htmlTocPath, this.options),
      ]).spread(
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
      archive.on('end', function () {
        if (this.options.verbose) {
          console.log('Done zipping, clearing temp dir...');
        }
        return rimraf(cwd, function (err) {
          if (err) {
            return reject(err);
          } else {
            return resolve('SUCCESS');
          }
        });
      });
      archive.on('error', function (err) {
        return reject(err);
      });
      archive.finalize();
    });
  }
}
