module.exports = function(eleventyConfig) {
  // Copiar la carpeta de assets (imágenes) al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");

  return {
    // Directorios de entrada y salida
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
