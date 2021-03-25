var fs = require('fs');

fs.readFile('src/assets/index.tpl', { encoding: 'utf8' }, function (err, tpl) {
  fs.readFile('dist/bundle.js', { encoding: 'utf8' }, function (err, js) {
    fs.writeFile('dist/template.html', tpl.replace('__JS__', encodeURI(js)), function () {
      console.log('updated template.html');
    });
  });
});
