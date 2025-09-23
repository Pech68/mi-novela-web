module.exports = function(eleventyConfig) {
  // Copia todos los archivos y carpetas necesarios al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("_includes");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("sw.js");
  eleventyConfig.addPassthroughCopy("auth.js"); // <-- Línea añadida y verificada

  // Crea una colección para NOVELAS
  eleventyConfig.addCollection("novel", function(collectionApi) {
    return collectionApi.getFilteredByTag("novel");
  });

  // Crea una colección para CAPÍTULOS
  eleventyConfig.addCollection("chapter", function(collectionApi) {
    return collectionApi.getFilteredByTag("chapter");
  });

  // Crea la lista de GÉNEROS
  eleventyConfig.addCollection("genresList", function(collectionApi) {
    const genresSet = new Set();
    collectionApi.getFilteredByTag("novel").forEach(item => {
      if ("genres" in item.data) {
        let genres = item.data.genres;
        if (typeof genres === "string") {
          genres = genres.split(",").map(item => item.trim());
        }
        genres.forEach(genre => genresSet.add(genre));
      }
    });
    return [...genresSet].sort();
  });

  // Helper para convertir texto a URL amigable
  eleventyConfig.addFilter("slugify", function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  // Configuración de plantillas
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
