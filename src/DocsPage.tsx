import {
  Code,
  CodeBlock,
  CopyButton,
  Link,
  Stack,
  Typography,
} from "@iantroisi/ui";
import type { ReactNode } from "react";
import { setupSample } from "./samples";

const SIGNATURE = `const { data, error, isLoading, isValidating, mutate } = useSteddy(key, fetcher, options)`;

export function DocsPage() {
  return (
    <article className="site-api-doc">
      <Typography variant="h1" as="h1" id="top">
        API
      </Typography>

      <Stack gap={6} className="site-api-doc__body">
        <SampleBlock code={SIGNATURE} />

        <ApiSection id="parameters" title="Parameters">
          <ApiList>
            <ApiItem name="key">
              A unique cache key: a string, a tuple{" "}
              <Code>["scope", ...Serializable]</Code>, or <Code>null</Code> to
              skip fetching. Tuples serialize with <Code>JSON.stringify</Code>.
            </ApiItem>
            <ApiItem name="fetcher" optional>
              A Promise-returning function{" "}
              <Code>(key, {"{ signal }"}) {"=>"} Promise&lt;T&gt;</Code>. Pass{" "}
              <Code>signal</Code> into <Code>fetch</Code> so superseded requests
              abort cleanly.
            </ApiItem>
            <ApiItem name="options" optional>
              Hook options for this request (see Options).
            </ApiItem>
          </ApiList>
        </ApiSection>

        <ApiSection id="return-values" title="Return Values">
          <ApiList>
            <ApiItem name="data">
              Data for the given key from the fetcher, or <Code>undefined</Code>{" "}
              before the first successful settle. With{" "}
              <Code>keepPreviousData</Code>, may show the previous key&apos;s
              data while the new key loads.
            </ApiItem>
            <ApiItem name="error">
              Value thrown by the fetcher (<Code>unknown</Code>), or{" "}
              <Code>undefined</Code>.
            </ApiItem>
            <ApiItem name="isLoading">
              <Code>true</Code> when there is no settled data yet (
              <Code>hasData</Code> is false), no error, and no previous data to
              show. Undefined payloads can still count as loaded after a
              successful fetch.
            </ApiItem>
            <ApiItem name="isValidating">
              <Code>true</Code> while a fetch or revalidation is in flight for
              this key.
            </ApiItem>
            <ApiItem name="mutate(updater?, options?)">
              Imperative cache update for this key. Same shape as global{" "}
              <Code>mutate</Code> (see Mutate).
            </ApiItem>
          </ApiList>
          <Typography tone="muted" variant="small" className="site-api-note">
            Layering and abort behavior are described on the{" "}
            <Link href="https://cincinnatus101010.github.io/steddyweb/">
              explainer
            </Link>
            .
          </Typography>
        </ApiSection>

        <ApiSection id="options" title="Options">
          <ApiList>
            <ApiItem name="suspense" defaultValue="false">
              When <Code>true</Code>, throw the in-flight promise (then the
              error) for React Suspense. Hook-only — not a global default.
            </ApiItem>
            <ApiItem name="keepPreviousData" defaultValue="false">
              Keep showing the previous key&apos;s data until the new key settles
              (similar to SWR&apos;s option).
            </ApiItem>
            <ApiItem name="staleTime" defaultValue="2000">
              Milliseconds after a successful write before{" "}
              <Code>revalidate</Code> runs again on mount. In-flight requests
              for the same key always abort and restart; this window only dedups
              completed cache hits unless <Code>force: true</Code>.
            </ApiItem>
          </ApiList>
          <Typography tone="muted" variant="small" className="site-api-note">
            Focus, reconnect, polling, retry, and TTL are plugins wired at the
            app root — not per-hook options. See Global configuration.
          </Typography>
        </ApiSection>

        <ApiSection id="global" title="Global configuration">
          <Typography as="p" tone="muted">
            Create one runtime per app (per HTTP request on the server). Wire
            plugins once; hooks stay thin.
          </Typography>
          <SampleBlock code={setupSample} />
          <ApiList>
            <ApiItem name="attachDefaults(coordinator, store, options?)">
              Registers focus revalidate, reconnect revalidate, and TTL eviction.
              Default TTL: <Code>maxAge: 300_000</Code> (5 minutes). Pass{" "}
              <Code>{"{ ttl: { maxAge, maxKeys, interval } }"}</Code> to tune
              eviction.
            </ApiItem>
            <ApiItem name="focusRevalidate(coordinator, store)">
              Revalidate subscribed keys when the document becomes visible.
            </ApiItem>
            <ApiItem name="reconnectRevalidate(coordinator, store)">
              Revalidate subscribed keys when <Code>online</Code> fires.
            </ApiItem>
            <ApiItem name="pollingRevalidate(coordinator, intervalMs)">
              Interval revalidation for registered keys.
            </ApiItem>
            <ApiItem name="retryOnError(fetcher, options?)">
              Wraps a fetcher with retries (does not call{" "}
              <Code>revalidate</Code>, so in-flight abort semantics stay intact).
            </ApiItem>
            <ApiItem name="ttlEvict(coordinator, options)">
              Calls <Code>coordinator.evict</Code> on an interval. Never evicts
              in-flight or subscribed keys.
            </ApiItem>
            <ApiItem name="measurePerf(coordinator)">
              Subscribe to coordinator events for starts, aborts, dedups, writes,
              errors, and <Code>totalMs</Code>.
            </ApiItem>
          </ApiList>
        </ApiSection>

        <ApiSection id="mutate" title="Mutate">
          <SampleBlock
            code={`import { mutate } from "steddy";

await mutate(["user", id], (current) => ({ ...current, name: "Ada" }), {
  revalidate: true,
  rollbackOnError: true,
});`}
          />
          <ApiList>
            <ApiItem name="mutate(key, updater, options?)">
              Global imperative update against the default runtime, or the{" "}
              <Code>SteddyProvider</Code> runtime when called from a hook
              context. Successful mutations revalidate with{" "}
              <Code>force: true</Code> by default.
            </ApiItem>
            <ApiItem name="revalidate" defaultValue="true">
              Fetch again after the optimistic write succeeds.
            </ApiItem>
            <ApiItem name="rollbackOnError" defaultValue="true">
              Restore the prior cache entry (including <Code>error</Code>) if the
              updater throws.
            </ApiItem>
          </ApiList>
        </ApiSection>

        <ApiSection id="ssr" title="SSR / prefetch">
          <ApiList>
            <ApiItem name="createRuntime()">
              New <Code>store</Code> + <Code>coordinator</Code> pair for{" "}
              <Code>SteddyProvider</Code>.
            </ApiItem>
            <ApiItem name="dump(store)">
              JSON-safe snapshot of settled entries for the client boundary.
            </ApiItem>
            <ApiItem name="hydrateAll(snapshot, store)">
              Restore a dump; preserves timestamps so dedup can skip an immediate
              refetch.
            </ApiItem>
            <ApiItem name="prefetch(key, fetcher, runtime)">
              Warm a key without mounting a hook.
            </ApiItem>
            <ApiItem name="clear(key?, runtime)">
              Drop one key or reset the whole cache; aborts in-flight work.
            </ApiItem>
          </ApiList>
        </ApiSection>

        <ApiSection id="infinite" title="useSteddyInfinite">
          <SampleBlock
            code={`const { data, size, setSize, mutate } = useSteddyInfinite(
  (index, previousPage) =>
    previousPage?.nextCursor == null
      ? null
      : ["users", previousPage.nextCursor],
  ([, cursor]) => fetchUsersPage(cursor),
);`}
          />
          <Typography as="p" tone="muted">
            One cache entry per page. <Code>collectPages</Code> stops when{" "}
            <Code>getKey</Code> would reuse a serialized key (cursor pagination).{" "}
            <Code>mutate</Code> updates every loaded page.
          </Typography>
        </ApiSection>

        <ApiSection id="mcp" title="MCP for agents">
          <Typography as="p" tone="muted">
            Build <Code>mcp/</Code> in the{" "}
            <Link href="https://github.com/Cincinnatus101010/steddy">
              steddy
            </Link>{" "}
            repo, then point Cursor at the compiled server:
          </Typography>
          <SampleBlock
            code={`{
  "mcpServers": {
    "steddy": {
      "command": "node",
      "args": ["mcp/dist/index.js"]
    }
  }
}`}
          />
          <Typography variant="small" tone="muted">
            Tools: <Code>steddy_list_topics</Code>,{" "}
            <Code>steddy_get_topic</Code>, <Code>steddy_search_docs</Code>.
            Resources: <Code>steddy://docs/&lt;topic&gt;</Code>.
          </Typography>
        </ApiSection>
      </Stack>
    </article>
  );
}

function ApiSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="site-api-section">
      <Typography variant="h2" as="h2">
        {title}
      </Typography>
      <Stack gap={4}>{children}</Stack>
    </section>
  );
}

function ApiList({ children }: { children: ReactNode }) {
  return <ul className="site-api-list">{children}</ul>;
}

function ApiItem({
  name,
  defaultValue,
  optional,
  children,
}: {
  name: string;
  defaultValue?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  const label =
    defaultValue != null
      ? `${name} = ${defaultValue}`
      : optional
        ? `${name} (optional)`
        : name;
  return (
    <li className="site-api-item">
      <Code>{label}</Code>
      <span className="site-api-item__sep">: </span>
      <span className="site-api-item__desc">{children}</span>
    </li>
  );
}

function SampleBlock({ code }: { code: string }) {
  return (
    <Stack gap={2} className="site-docs-sample">
      <div className="site-code-toolbar">
        <CopyButton value={code} label="Copy" copiedLabel="Copied" />
      </div>
      <CodeBlock>{code}</CodeBlock>
    </Stack>
  );
}
