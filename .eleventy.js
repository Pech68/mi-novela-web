module.exports = function(eleventyConfig) {
  // Copiar la carpeta de assets (imágenes) y el CSS al sitio final
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("style.css"); // <-- ESTA ES LA LÍNEA NUEVA Y CORREGIDA

  return {
    // Directorios de entrada y salida
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
