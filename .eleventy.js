module.exports = function(eleventyConfig) {
  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy("src/og-image.png");

  // Collections for future content buildout
  eleventyConfig.addCollection("biomarkers", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/biomarkers/**/*.njk")
      .filter(item => !item.data.eleventyExcludeFromCollections)
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/**/*.njk")
      .filter(item => !item.data.eleventyExcludeFromCollections)
      .sort((a, b) => b.date - a.date);
  });

  // Date filter — used by sitemap.njk
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return new Date().toISOString().split("T")[0];
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Initials filter — used by biomarker.njk author/reviewer avatar
  // e.g. "Dan Carey" → "DC", "Peter Attia MD" → "PA"
  eleventyConfig.addFilter("initials", (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
