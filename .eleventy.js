module.exports = function(eleventyConfig) {

  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  // Collections for future content buildout
  eleventyConfig.addCollection("biomarkers", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/biomarkers/**/*.njk")
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.njk")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
