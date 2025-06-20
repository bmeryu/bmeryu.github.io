// build-tailwind.js
const fs = require('fs');
const postcss = require('postcss');
const { plugins } = require('./postcss.config.js'); // Load plugins from postcss.config.js

async function buildCss() {
  try {
    const inputFile = './input.css';
    const outputFile = './output.css';

    if (!fs.existsSync(inputFile)) {
      console.error(`Error: ${inputFile} not found.`);
      process.exit(1);
    }

    const css = fs.readFileSync(inputFile, 'utf8');

    // Explicitly pass plugins
    const result = await postcss(plugins)
      .process(css, { from: inputFile, to: outputFile });

    fs.writeFileSync(outputFile, result.css);

    if (result.warnings()) {
      result.warnings().forEach(warn => {
        console.warn(warn.toString());
      });
    }
    console.log(`Successfully built ${outputFile}`);

  } catch (error) {
    console.error('Error building CSS:', error);
    if (error.showSourceCode) { // Check if this property exists
        console.error('Tailwind CSS error details:');
        console.error(error.showSourceCode(false));
    }
    process.exit(1);
  }
}

buildCss();
