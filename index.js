const path = require('path');
const visit = require('unist-util-visit');

module.exports = function plugin({markdownAST, markdownNode}) {
  function visitor(node) {
    if (
      !node.url.startsWith('/') &&
      !node.url.startsWith('#') &&
      !node.url.startsWith('mailto:') &&
      !/^https?:\/\//.test(node.url)
    ) {
      node.url = path.resolve(
        markdownNode.fields.slug
          .replace(/\/$/, '')
          .split(path.sep)
          .slice(0, -1)
          .join(path.sep),
        node.url
      );
    }
  }

  visit(markdownAST, 'link', visitor);

  return markdownAST;
};
