/* eslint-env jest */
import plugin = require('.');
import {link, root, text} from 'mdast-builder';

describe('rewrites relative links', (): void => {
  it('from root-level pages', (): void => {
    const mdLink = link('./foo', '', text('a link'));
    const mdast = plugin({
      markdownAST: root([mdLink]),
      markdownNode: {
        fields: {
          slug: '/bar/'
        }
      },
      pathPrefix: ''
    });

    expect(mdast).toEqual({
      type: 'root',
      children: [
        {
          ...mdLink,
          url: '/foo/'
        }
      ]
    });
  });

  it('from pages in a subdirectory', (): void => {
    const sibling = link('foo', '', text('a sibling link'));
    const uncle = link('../bar', '', text('an uncle link'));
    const mdast = plugin({
      markdownAST: root([sibling, uncle]),
      markdownNode: {
        fields: {
          slug: '/subdir/baz/'
        }
      },
      pathPrefix: ''
    });

    expect(mdast).toEqual({
      type: 'root',
      children: [
        {
          ...sibling,
          url: '/subdir/foo/'
        },
        {
          ...uncle,
          url: '/bar/'
        }
      ]
    });
  });

  it('with a path prefix', (): void => {
    const mdLink = link('./foo/bar', '', text('a link'));
    const mdast = plugin({
      markdownAST: root([mdLink]),
      markdownNode: {
        fields: {
          slug: '/baz/'
        }
      },
      pathPrefix: '/my-prefix'
    });

    expect(mdast).toEqual({
      type: 'root',
      children: [
        {
          ...mdLink,
          url: '/my-prefix/foo/bar/'
        }
      ]
    });
  });

  it('preserves hashes', (): void => {
    const mdLink = link('../intro#usage', '', text('how to use'));
    const mdast = plugin({
      markdownAST: root([mdLink]),
      markdownNode: {
        fields: {
          slug: '/essentials/queries/'
        }
      },
      pathPrefix: ''
    });

    expect(mdast).toEqual({
      type: 'root',
      children: [
        {
          ...mdLink,
          url: '/intro/#usage'
        }
      ]
    });
  });
});
