module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("_includes");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("sw.js");

  // Crea una colección para NOVELAS
  eleventyConfig.addCollection("novel", function(collectionApi) {
    return collectionApi.getFilteredByTag("novel");
  });

  // Crea una colección para CAPÍTULOS
  eleventyConfig.addCollection("chapter", function(collectionApi) {
    return collectionApi.getFilteredByTag("chapter");
  });

  // --- CÓDIGO NUEVO PARA GÉNEROS ---
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
  // --- FIN DEL CÓDIGO NUEVO ---

  // Helper para convertir texto a URL amigable (ej. "Ciencia Ficción" -> "ciencia-ficcion")
  eleventyConfig.addFilter("slugify", function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
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
