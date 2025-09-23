module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("_includes");

  // Crea una colección para NOVELAS
  eleventyConfig.addCollection("novel", function(collectionApi) {
    return collectionApi.getFilteredByTag("novel");
  });

  // Crea una colección para CAPÍTULOS
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
