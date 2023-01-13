import { Data, renderFile } from 'ejs';

export default (filename: string, data: Data): Promise<string> =>
  new Promise((resolve, reject) => {
    renderFile(filename, data, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
