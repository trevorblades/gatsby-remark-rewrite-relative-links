import * as path from 'path';
import * as visit from 'unist-util-visit';
import {Link, Parent} from 'mdast';

function withPathPrefix(url: string, pathPrefix: string): string {
  const prefixed = pathPrefix + url;
  return prefixed.replace(/\/\//, '/');
}

export = function plugin({
  markdownAST,
  markdownNode,
  pathPrefix,
  getNode
}): Parent {
  function visitor(node: Link): void {
    if (
      markdownNode.fields &&
      markdownNode.fields.slug &&
      !node.url.startsWith('/') &&
      !node.url.startsWith('#') &&
      !node.url.startsWith('mailto:') &&
      !/^https?:\/\//.test(node.url)
    ) {
      const parent = getNode(markdownNode.parent);
      node.url = withPathPrefix(
        path
          .resolve(
            markdownNode.fields.slug
              .replace(/\/$/, '')
              .split(path.sep)
              .slice(0, parent.name === 'index' ? undefined : -1)
              .join(path.sep) || '/',
            node.url
          )
          .replace(/\/?(\?|#|$)/, '/$1'),
        pathPrefix
      );
    }
  }

  visit(markdownAST, 'link', visitor);

  return markdownAST;
};
