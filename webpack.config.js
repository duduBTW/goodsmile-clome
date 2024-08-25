const path = require("path");
const fs = require("fs");

console.log(generateEntries("./client/pages"));

module.exports = {
  entry: generateEntries("./client/pages"), // Entry point for your TypeScript files
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "static/dist"), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Match TypeScript files
        use: "ts-loader", // Use ts-loader to compile TypeScript
        exclude: /node_modules/, // Exclude node_modules
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve both .ts and .js files
  },
  mode: "development", // Set the mode to production (you can also use 'development')
  watch: true,
};

function generateEntries(pagesDir) {
  const files = fs.readdirSync(pagesDir);
  if (files.length <= 0) {
    throw new Error("No pages");
  }

  return files.reduce((acc, file) => {
    const fileName = file.split(".").slice(0, -1).join(".");
    acc[fileName] = path.join(__dirname, pagesDir, file);
    return acc;
  }, {});
}
