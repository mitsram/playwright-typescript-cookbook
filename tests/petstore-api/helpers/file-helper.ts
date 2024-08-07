import fs from 'fs';
import path from 'path';

const mkDirByPathSync = (targetDir: string, { isRelativeToScript = false } = {}) => {

    const { sep } = path; // object destructuring
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';
  
    return targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir);
      try {
        fs.mkdirSync(curDir);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.code === 'EEXIST') { // curDir already exists!
          return curDir;
        }
  
        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
          throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
        }
  
        const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
        // eslint-disable-next-line no-mixed-operators
        if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
          throw err; // Throw if it's just the last created dir.
        }
      }  
      return curDir;
    }, initDir);
};

export {
  mkDirByPathSync,
};
