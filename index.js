const path = require('path');
const visit = require('unist-util-visit');

function withPathPrefix(url, pathPrefix) {
  const prefixed = pathPrefix + url;
  return prefixed.replace(/\/\//, '/');
}

module.exports = function plugin({markdownAST, markdownNode, pathPrefix}) {
  function visitor(node) {
    if (
      !node.url.startsWith('/') &&
      !node.url.startsWith('#') &&
      !node.url.startsWith('mailto:') &&
      !/^https?:\/\//.test(node.url)
    ) {
      node.url = withPathPrefix(
        path.resolve(
          markdownNode.fields.slug
            .replace(/\/$/, '')
            .split(path.sep)
            .slice(0, -1)
            .join(path.sep),
          node.url
        ),
        pathPrefix
      );
    }
  }

  visit(markdownAST, 'link', visitor);

  return markdownAST;
};
