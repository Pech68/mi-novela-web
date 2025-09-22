module.exports = function(eleventyConfig) {
  // Copiar la carpeta de assets, admin y el CSS al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css");

  // ESTA ES LA PARTE NUEVA Y MÁS IMPORTANTE
  // Crea una colección llamada "novelas" a partir de todos los archivos
  // que tengan la etiqueta "novelas"
  eleventyConfig.addCollection("novelas", function(collectionApi) {
    return collectionApi.getFilteredByTag("novelas");
  });

  return {
    // Directorios de entrada y salida
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
