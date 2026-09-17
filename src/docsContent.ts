export type DocSection = {
  id: string;
  title: string;
  body: string;
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "install",
    title: "Install",
    body: `npm install steddy@0.1.3

Peer: React 18+. The hook uses useSyncExternalStore.`,
  },
  {
    id: "setup",
    title: "App root",
    body: `Create one runtime per app (per HTTP request on the server). Wire plugins once at the root — not inside the hook.

• createRuntime() → SteddyProvider
• attachDefaults(coordinator, store) → focus, reconnect, TTL
• prefetch(key, fetcher) for loaders / link hover
• focusRevalidate(coordinator, store) so only mounted keys revalidate`,
  },
  {
    id: "architecture",
    title: "Layers",
    body: `plugins → coordinator → store
                ↑
              hooks

The store never fetches. Plugins never import the store. Hooks never import plugins. Aborted requests do not write.`,
  },
  {
    id: "hook",
    title: "useSteddy",
    body: `useSteddy(key, fetcher, options?)

Options: { suspense, keepPreviousData, staleTime } — default staleTime is 2000ms.

Returns data, error (unknown), isLoading, isValidating, mutate.

key === null skips fetch. isLoading means the key never settled (hasData), not data === undefined. Pass signal into fetch.`,
  },
  {
    id: "mutate",
    title: "mutate",
    body: `Hook-bound mutate(key) or global mutate(key, updater, options).

Optimistic updates roll back on error by default. revalidate defaults to true; mutate uses force revalidate.`,
  },
  {
    id: "ssr",
    title: "SSR / RSC",
    body: `Server: createRuntime(), fetch, dump(store) → JSON cache.

Client: SteddyProvider cache={payload} hydrates in an effect (identical snapshots deduped). Timestamps from dump are preserved.

Do not use the module singleton on the server without a provider — dev warns once.`,
  },
  {
    id: "infinite",
    title: "useSteddyInfinite",
    body: `One cache entry per page. mutate writes every page. collectPages stops when getKey would reuse a serialized key (cursor pagination).`,
  },
  {
    id: "plugins",
    title: "Plugins",
    body: `attachDefaults, focusRevalidate, reconnectRevalidate, pollingRevalidate, retryOnError (fetcher wrapper), ttlEvict, measurePerf.

Import only what you use — tree-shake test enforces hook-only bundles.`,
  },
  {
    id: "reliability",
    title: "Reliability",
    body: `• Same key: abort in-flight; latest write wins
• Last subscriber: delayed abort (UNSUBSCRIBE_GRACE_MS); remount reuses waiter
• Dedup within staleTime unless force: true
• Store skips notify when entry unchanged (Object.is on data)`,
  },
  {
    id: "mcp",
    title: "MCP for agents",
    body: `Repo: mcp/ — build with npm run build, run node dist/index.js via Cursor MCP config.

Tools: steddy_list_topics, steddy_get_topic, steddy_search_docs. Resources: steddy://docs/<topic>.`,
  },
];
