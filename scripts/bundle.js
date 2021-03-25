const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const dir = path.join(process.cwd(), 'dist');
const filename = path.join(dir, 'bundle.js');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, 0744);
  fs.writeFileSync(filename, 'file contents');
}

browserify()
  .add('src/index.ts')
  .plugin(require('tsify'), { project: './tsconfig.json' })
  .plugin(require('tinyify'), { flat: false })
  .bundle()
  .pipe(fs.createWriteStream(filename));
