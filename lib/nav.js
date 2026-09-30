// Sidebar order. Slugs are paths under /content without the .md extension.
export const nav = [
  { group: 'Getting started', pages: ['index', 'getting-started/quickstart', 'getting-started/installation', 'getting-started/authentication'] },
  { group: 'Concepts', pages: ['concepts/flags', 'concepts/environments', 'concepts/targeting-rules', 'concepts/percentage-rollouts'] },
  { group: 'Guides', pages: ['guides/progressive-delivery', 'guides/kill-switches', 'guides/testing-with-flags', 'guides/cleaning-up-stale-flags'] },
  { group: 'API reference', pages: ['api/overview', 'api/flags', 'api/evaluations', 'api/errors'] },
  { group: 'Help', pages: ['faq'] },
];

export const flatNav = nav.flatMap((g) => g.pages);
