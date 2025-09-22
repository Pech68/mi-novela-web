module.exports = function(eleventyConfig) {
  // Copiar la carpeta de assets, admin y el CSS al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");

  // Crea una colección llamada "novelas" a partir de todos los archivos
  // que tengan la etiqueta "novelas"
  eleventyConfig.addCollection("novelas", function(collectionApi) {
    return collectionApi.getFilteredByTag("novelas");
  });

  // --- ESTA ES LA PARTE NUEVA Y CORREGIDA ---
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
