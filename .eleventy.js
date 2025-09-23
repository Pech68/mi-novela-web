module.exports = function(eleventyConfig) {
  // Copia los archivos y carpetas necesarios al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("_includes");
  eleventyConfig.addPassthroughCopy("manifest.json"); // <-- NUEVO
  eleventyConfig.addPassthroughCopy("sw.js");           // <-- NUEVO

  // Crea una colección para las NOVELAS
  eleventyConfig.addCollection("novel", function(collectionApi) {
    return collectionApi.getFilteredByTag("novel");
  });
  
  // Crea una colección para los CAPÍTULOS
  eleventyConfig.addCollection("chapter", function(collectionApi) {
    return collectionApi.getFilteredByTag("chapter");
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
