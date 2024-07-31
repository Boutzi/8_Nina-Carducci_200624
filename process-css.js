const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./**/*.html', './**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});
const cssnano = require('cssnano');
const terser = require('terser');

// Fonction pour minifier les fichiers CSS
const minifyCss = (file) => {
  fs.readFile(file, 'utf8', (err, css) => {
    if (err) {
      console.error(`Error reading CSS file ${file}: ${err}`);
      return;
    }

    postcss([autoprefixer, purgecss, cssnano])
      .process(css, { from: file, to: file.replace('.css', '.min.css'), map: { inline: false } })
      .then(result => {
        fs.writeFile(file.replace('.css', '.min.css'), result.css, (err) => {
          if (err) {
            console.error(`Error writing minified CSS file: ${err}`);
            return;
          }
          console.log(`CSS file minified successfully: ${file.replace('.css', '.min.css')}`);
        });

        if (result.map) {
          fs.writeFile(file.replace('.css', '.min.css.map'), result.map.toString(), (err) => {
            if (err) {
              console.error(`Error writing CSS map file: ${err}`);
            } else {
              console.log(`CSS map file written successfully: ${file.replace('.css', '.min.css.map')}`);
            }
          });
        }
      })
      .catch(error => {
        console.error(`PostCSS processing error: ${error}`);
      });
  });
};

// Fonction pour minifier les fichiers JS
const minifyJs = (file) => {
  fs.readFile(file, 'utf8', (err, js) => {
    if (err) {
      console.error(`Error reading JS file ${file}: ${err}`);
      return;
    }

    // Simplified minification
    const result = terser.minify(js);

    if (result.error) {
      console.error(`Terser error: ${result.error}`);
      return;
    }

    if (result.code) {
      fs.writeFile(file.replace('.js', '.min.js'), result.code, (err) => {
        if (err) {
          console.error(`Error writing minified JS file: ${err}`);
        } else {
          console.log(`JS file minified successfully: ${file.replace('.js', '.min.js')}`);
        }
      });

      if (result.map) {
        fs.writeFile(file.replace('.js', '.min.js.map'), result.map, (err) => {
          if (err) {
            console.error(`Error writing JS map file: ${err}`);
          } else {
            console.log(`JS map file written successfully: ${file.replace('.js', '.min.js.map')}`);
          }
        });
      }
    } else {
      console.error(`No code produced for file ${file}`);
    }
  });
};


// Liste des fichiers CSS et JS à minifier
const cssFiles = ['./assets/style.css'];
const jsFiles = []; // Ajoutez ici vos fichiers JS

// Minifier les fichiers CSS
cssFiles.forEach(file => minifyCss(file));

// Minifier les fichiers JS
jsFiles.forEach(file => minifyJs(file));
