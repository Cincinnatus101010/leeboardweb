import {
  Badge,
  Callout,
  Code,
  CodeBlock,
  Container,
  CopyButton,
  DescriptionItem,
  DescriptionList,
  Divider,
  Link,
  PageHeader,
  Panel,
  Stack,
  Typography,
} from "@iantroisi/ui";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { API_NAV } from "./apiNav";
import { setupSample } from "./samples";

const SIGNATURE = `const { data, error, isLoading, isValidating, mutate } = useSteddy(key, fetcher, options)`;

export function DocsPage() {
  return (
    <Container className="site-api-wrap">
      <div className="site-api-layout">
        <DocsSidebar />

        <div className="site-api-main">
          <PageHeader
            className="site-api-header"
            title="useSteddy"
            description="Stale-while-revalidate data fetching for React. One hook, strict layers — abort in-flight work, dedup completed cache hits, plugins stay out of the store."
            actions={
              <Stack direction="row" gap={2} className="site-api-header__actions">
                <RouterLink to="/" className="site-docs-cta">
                  Explainer
                </RouterLink>
                <Link
                  href="https://www.npmjs.com/package/steddy"
                  className="site-docs-cta site-docs-cta--primary"
                >
                  npm
                </Link>
              </Stack>
            }
          />

          <SampleBlock code={SIGNATURE} label="Signature" />

          <ApiSection id="parameters" title="Parameters">
            <RefPanel>
              <ApiRef
                name="key"
                description={
                  <>
                    Unique cache key: a string, tuple{" "}
                    <Code>["scope", ...Serializable]</Code>, or <Code>null</Code>{" "}
                    to skip fetching. Tuple keys serialize with{" "}
                    <Code>JSON.stringify</Code>.
                  </>
                }
              />
              <ApiRef
                name="fetcher"
                badge="optional"
                description={
                  <>
                    <Code>(key, {"{ signal }"}) {"=>"} Promise&lt;T&gt;</Code>.
                    Pass <Code>signal</Code> into <Code>fetch</Code> so superseded
                    requests abort without writing to the cache.
                  </>
                }
              />
              <ApiRef
                name="options"
                badge="optional"
                description="Per-hook options. See Options below."
              />
            </RefPanel>
          </ApiSection>

          <ApiSection id="return-values" title="Return values">
            <RefPanel>
              <ApiRef
                name="data"
                description={
                  <>
                    Resolved fetcher data, or <Code>undefined</Code> before the first
                    successful settle. With <Code>keepPreviousData</Code>, may show
                    the previous key until the new key loads.
                  </>
                }
              />
              <ApiRef
                name="error"
                description={
                  <>
                    Fetcher throw value (<Code>unknown</Code>), or{" "}
                    <Code>undefined</Code>.
                  </>
                }
              />
              <ApiRef
                name="isLoading"
                description={
                  <>
                    <Code>true</Code> when nothing has settled yet (
                    <Code>hasData</Code> is false), there is no error, and no
                    previous data to display.
                  </>
                }
              />
              <ApiRef
                name="isValidating"
                description="True while a fetch or revalidation is in flight for this key."
              />
              <ApiRef
                name="mutate"
                description={
                  <>
                    Key-bound imperative update. Same options as global{" "}
                    <Code>mutate</Code>.
                  </>
                }
              />
            </RefPanel>
            <Callout variant="info" title="Reliability">
              Overlapping requests for the same key abort the older one; only the
              latest generation writes. See the{" "}
              <RouterLink to="/" className="site-router-link">
                explainer
              </RouterLink>{" "}
              for demos.
            </Callout>
          </ApiSection>

          <ApiSection id="options" title="Options">
            <RefPanel>
              <ApiRef
                name="suspense"
                defaultValue="false"
                description="Throw the in-flight promise (then the error) for React Suspense."
              />
              <ApiRef
                name="keepPreviousData"
                defaultValue="false"
                description="Show the previous key's data until the new key settles."
              />
              <ApiRef
                name="staleTime"
                defaultValue="2000"
                description={
                  <>
                    Ms after a successful write before mount triggers another{" "}
                    <Code>revalidate</Code>. In-flight work always aborts and
                    restarts; this window dedups completed entries unless{" "}
                    <Code>force: true</Code>.
                  </>
                }
              />
            </RefPanel>
            <Callout title="Plugins are global">
              Focus, reconnect, polling, retry, and TTL mount on the coordinator at
              the app root — not as hook options. See Global configuration.
            </Callout>
          </ApiSection>

          <ApiSection id="global" title="Global configuration">
            <Typography tone="muted" as="p">
              One <Code>createRuntime()</Code> per app (per request on the server).
              Wire plugins once; hooks only subscribe and fetch.
            </Typography>
            <SampleBlock code={setupSample} label="App root" />
            <RefPanel>
              <ApiRef
                name="attachDefaults"
                description={
                  <>
                    Focus + reconnect + TTL eviction. Default{" "}
                    <Code>maxAge: 300_000</Code>. Pass{" "}
                    <Code>{"{ ttl: { maxAge, maxKeys, interval } }"}</Code>.
                  </>
                }
              />
              <ApiRef
                name="focusRevalidate"
                description="Revalidate subscribed keys when the document becomes visible."
              />
              <ApiRef
                name="reconnectRevalidate"
                description="Revalidate subscribed keys on browser reconnect."
              />
              <ApiRef
                name="pollingRevalidate"
                description="Interval revalidation for registered keys."
              />
              <ApiRef
                name="retryOnError"
                description="Fetcher wrapper with retries — does not call revalidate mid-flight."
              />
              <ApiRef
                name="ttlEvict"
                description="Periodic evict via coordinator; skips in-flight and subscribed keys."
              />
              <ApiRef
                name="measurePerf"
                description="Coordinator event counters: starts, aborts, dedups, writes, errors, totalMs."
              />
            </RefPanel>
          </ApiSection>

          <ApiSection id="mutate" title="Mutate">
            <SampleBlock
              label="Global mutate"
              code={`import { mutate } from "steddy";

await mutate(["user", id], (current) => ({ ...current, name: "Ada" }), {
  revalidate: true,
  rollbackOnError: true,
});`}
            />
            <RefPanel>
              <ApiRef
                name="mutate(key, updater, options?)"
                description="Imperative update on the active runtime. Successful writes revalidate with force by default."
              />
              <ApiRef
                name="revalidate"
                defaultValue="true"
                description="Fetch again after a successful optimistic write."
              />
              <ApiRef
                name="rollbackOnError"
                defaultValue="true"
                description="Restore the prior entry (including error) if the updater throws."
              />
            </RefPanel>
          </ApiSection>

          <ApiSection id="ssr" title="SSR & prefetch">
            <RefPanel>
              <ApiRef
                name="createRuntime()"
                description="Fresh store + coordinator for SteddyProvider."
              />
              <ApiRef
                name="dump(store)"
                description="JSON-safe snapshot of settled entries for the client."
              />
              <ApiRef
                name="hydrateAll(snapshot, store)"
                description="Restore dump timestamps so dedup can skip an immediate refetch."
              />
              <ApiRef
                name="prefetch(key, fetcher, runtime)"
                description="Warm a key without mounting a hook."
              />
              <ApiRef
                name="clear(key?, runtime)"
                description="Drop one key or reset the cache; aborts in-flight work."
              />
            </RefPanel>
          </ApiSection>

          <ApiSection id="infinite" title="useSteddyInfinite">
            <SampleBlock
              label="Cursor pages"
              code={`const { data, size, setSize, mutate } = useSteddyInfinite(
  (index, previousPage) =>
    previousPage?.nextCursor == null
      ? null
      : ["users", previousPage.nextCursor],
  ([, cursor]) => fetchUsersPage(cursor),
);`}
            />
            <Typography tone="muted" as="p">
              One cache entry per page. <Code>collectPages</Code> stops when{" "}
              <Code>getKey</Code> would reuse a serialized key.{" "}
              <Code>mutate</Code> updates every loaded page.
            </Typography>
          </ApiSection>

          <ApiSection id="mcp" title="MCP for agents">
            <Typography tone="muted" as="p">
              Build <Code>mcp/</Code> in the{" "}
              <Link href="https://github.com/Cincinnatus101010/steddy">
                steddy
              </Link>{" "}
              repo, then register the compiled server in Cursor:
            </Typography>
            <SampleBlock
              label="Cursor MCP"
              code={`{
  "mcpServers": {
    "steddy": {
      "command": "node",
      "args": ["mcp/dist/index.js"]
    }
  }
}`}
            />
            <RefPanel>
              <ApiRef
                name="steddy_list_topics"
                description="List documentation topic ids."
              />
              <ApiRef
                name="steddy_get_topic"
                description="Full markdown for one topic."
              />
              <ApiRef
                name="steddy_search_docs"
                description="Keyword search with snippets."
              />
              <ApiRef
                name="steddy://docs/<topic>"
                description="MCP resource URI mirroring topic content."
              />
            </RefPanel>
          </ApiSection>
        </div>
      </div>
    </Container>
  );
}

function DocsSidebar() {
  return (
    <nav className="site-api-sidebar" aria-label="API sections">
      <Typography variant="small" tone="muted" className="site-api-sidebar__label">
        On this page
      </Typography>
      <ul className="site-api-sidebar__list">
        {API_NAV.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="site-api-sidebar__link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
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
      <Typography variant="h2" as="h2" className="site-api-section__title">
        {title}
      </Typography>
      <Stack gap={4}>{children}</Stack>
      <Divider className="site-api-section__rule" />
    </section>
  );
}

function RefPanel({ children }: { children: ReactNode }) {
  return (
    <Panel padding={4} className="site-api-ref-panel">
      <DescriptionList>{children}</DescriptionList>
    </Panel>
  );
}

function ApiRef({
  name,
  description,
  defaultValue,
  badge,
}: {
  name: string;
  description: ReactNode;
  defaultValue?: string;
  badge?: "optional";
}) {
  return (
    <DescriptionItem
      term={
        <span className="site-api-term">
          <Code>{name}</Code>
          {defaultValue != null ? (
            <Badge variant="default">default {defaultValue}</Badge>
          ) : null}
          {badge === "optional" ? (
            <Badge variant="default">optional</Badge>
          ) : null}
        </span>
      }
    >
      {description}
    </DescriptionItem>
  );
}

function SampleBlock({ code, label }: { code: string; label?: string }) {
  return (
    <Panel padding={0} className="site-api-code-panel">
      <div className="site-api-code-panel__bar">
        {label ? (
          <Typography variant="small" tone="muted">
            {label}
          </Typography>
        ) : (
          <span />
        )}
        <CopyButton value={code} label="Copy" copiedLabel="Copied" />
      </div>
      <CodeBlock>{code}</CodeBlock>
    </Panel>
  );
}
