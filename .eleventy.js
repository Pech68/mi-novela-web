module.exports = function(eleventyConfig) {
  // Copiar carpetas y archivos necesarios al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("_includes"); // <-- ¡LÍNEA AÑADIDA!

  // Crea una colección llamada "novelas" a partir de todos los archivos
  // que tengan la etiqueta "novelas"
  eleventyConfig.addCollection("novelas", function(collectionApi) {
    return collectionApi.getFilteredByTag("novelas");
  });

  // Le decimos a Eleventy que use el "idioma" Nunjucks para los archivos HTML.
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
