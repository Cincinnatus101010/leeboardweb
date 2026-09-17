import {
  Accordion,
  Alert,
  Badge,
  Button,
  Callout,
  Card,
  Code,
  CodeBlock,
  CopyButton,
  Divider,
  Grid,
  Hero,
  Link,
  List,
  ListItem,
  Section,
  Stack,
  Stat,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Tag,
  Timeline,
  TimelineItem,
  Typography,
  useMediaQuery,
} from "@iantroisi/ui";
import { RaceDemo } from "./RaceDemo";
import { hookSample, mutateSample, pluginSample, extraSample } from "./samples";

function Sample({ code }: { code: string }) {
  return (
    <Stack gap={2}>
      <div className="site-code-toolbar">
        <CopyButton value={code} label="Copy" copiedLabel="Copied" />
      </div>
      <CodeBlock>{code}</CodeBlock>
    </Stack>
  );
}

export function HomePage() {
  const compact = useMediaQuery("(max-width: 47.99rem)", false);
  const cols = compact ? 1 : 2;

  return (
    <Stack gap={8}>
      <Hero
        id="top"
        eyebrow="React data fetching"
        title="A fetch layer that cannot roll"
        description="Steddy does the same job as useSWR — stale-while-revalidate — rebuilt so dedup, retry, mutation, and subscriptions cannot share one implicit object."
        actions={
          <>
            <Button
              onClick={() =>
                document.getElementById("api")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Read the API
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                document.getElementById("abort")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Watch a race
            </Button>
          </>
        }
      >
        <Stack direction="row" gap={2}>
          <Badge>React 18+</Badge>
          <Tag>useSyncExternalStore</Tag>
          <Badge variant="success">rollback on by default</Badge>
        </Stack>
      </Hero>

      <Grid cols={compact ? 1 : 3} gap={6}>
        <Stat label="In-flight rule" value="Abort, don’t race" />
        <Stat label="Dedup window" value="2 seconds" />
        <Stat label="Plugins in core" value="None" />
      </Grid>

      <Divider />

      <Section
        id="why"
        title="Why it exists"
        description="SWR’s reliability bugs mostly come from one place: a cache/config object that does too many jobs, with implicit ordering between them."
      >
        <Stack gap={4}>
          <Typography>
            Steddy’s fix is boring on purpose. Split those jobs into independent
            layers with explicit contracts. Each layer is testable in isolation
            and has zero knowledge of the layers above it.
          </Typography>
          <Callout variant="info" title="One-way dependency">
            <Code>plugins → coordinator → store</Code>, with hooks only calling
            downward. If a lower layer wants to talk to a higher one, register a
            callback from above. Never call up.
          </Callout>
        </Stack>
      </Section>

      <Section
        id="layers"
        title="The layers"
        description="The name is “steady” with intent: keep in-flight fetches on course. Each of these layers has one job."
      >
        <Timeline>
          <TimelineItem>
            <Typography variant="h3" as="h3">
              Store
            </Typography>
            <Typography tone="muted">
              A dumb <Code>Map</Code> of cache entries with per-key
              subscriptions. Built for <Code>useSyncExternalStore</Code> from
              the start. No fetch, no timers, no focus listeners. If a PR
              imports <Code>fetch</Code> here, reject it.
            </Typography>
          </TimelineItem>
          <TimelineItem>
            <Typography variant="h3" as="h3">
              Coordinator
            </Typography>
            <Typography tone="muted">
              Owns in-flight requests. Every fetch gets an{" "}
              <Code>AbortController</Code>. A new request for the same key
              aborts the old one, so a stale response cannot overwrite a
              fresher one.
            </Typography>
          </TimelineItem>
          <TimelineItem>
            <Typography variant="h3" as="h3">
              Hook
            </Typography>
            <Typography tone="muted">
              <Code>useSteddy</Code> registers the key, asks the coordinator to
              stay fresh, and subscribes to one store slice.{" "}
              <Code>key === null</Code> means don’t fetch.
            </Typography>
          </TimelineItem>
          <TimelineItem>
            <Typography variant="h3" as="h3">
              Plugins
            </Typography>
            <Typography tone="muted">
              Focus, reconnect, polling, and retry are opt-in modules. They
              only call <Code>coordinator.revalidate(key)</Code> — except retry,
              which wraps the fetcher so it does not abort itself.
            </Typography>
          </TimelineItem>
        </Timeline>
      </Section>

      <Section
        id="abort"
        title="The highest-value fix"
        description="Two rapid revalidate calls for the same key: only the second response ever reaches the store. The first is aborted, not raced."
      >
        <Stack gap={6}>
          <RaceDemo />
          <Alert variant="info" heading="Dedup is for completed fetches">
            After a successful write, further revalidates within 2s are no-ops
            unless you pass <Code>force: true</Code> (mutate does). Multiple
            mounted hooks share one in-flight request instead of aborting each
            other. The last subscriber’s unmount delays abort by a tick so a
            remount can reuse the waiter.
          </Alert>
        </Stack>
      </Section>

      <Section
        id="api"
        title="What you import"
        description="The hook is thin. Plugins are named exports so unused ones tree-shake out."
      >
        <Tabs defaultValue="hook">
          <TabsList>
            <TabsTrigger value="hook">useSteddy</TabsTrigger>
            <TabsTrigger value="mutate">mutate</TabsTrigger>
            <TabsTrigger value="plugins">plugins</TabsTrigger>
            <TabsTrigger value="extra">ssr / pages</TabsTrigger>
          </TabsList>
          <TabsPanel value="hook">
            <Stack gap={4}>
              <Typography tone="muted">
                Returns <Code>data</Code>, <Code>error</Code> (
                <Code>unknown</Code>), <Code>isLoading</Code>,{" "}
                <Code>isValidating</Code>, and a key-bound <Code>mutate</Code>.
                Pass the abort signal into <Code>fetch</Code> so cancelled work
                actually stops. <Code>keepPreviousData</Code> keeps the last
                value on screen while a new key loads. Import from{" "}
                <Code>steddy</Code>.
              </Typography>
              <Sample code={hookSample} />
            </Stack>
          </TabsPanel>
          <TabsPanel value="mutate">
            <Stack gap={4}>
              <Typography tone="muted">
                Optimistic write first. Rollback is on by default — if the
                updater promise rejects or the follow-up revalidate fails, the
                exact prior cache entry is restored, including{" "}
                <Code>error</Code>. Also exported as a global against the
                singleton store.
              </Typography>
              <Sample code={mutateSample} />
            </Stack>
          </TabsPanel>
          <TabsPanel value="plugins">
            <Stack gap={4}>
              <Typography tone="muted">
                None of these are imported by <Code>useSteddy</Code>. Attach them
                yourself, and call the returned cleanup on unmount.
              </Typography>
              <Sample code={pluginSample} />
            </Stack>
          </TabsPanel>
          <TabsPanel value="extra">
            <Stack gap={4}>
              <Typography tone="muted">
                Dump a per-request runtime across an RSC boundary. Suspense
                throws the in-flight waiter. Infinite pages are one cache
                entry each — <Code>mutate</Code> writes every page, and{" "}
                <Code>getKey</Code> must not reuse an earlier serialized key.
              </Typography>
              <Sample code={extraSample} />
            </Stack>
          </TabsPanel>
        </Tabs>
      </Section>

      <Section
        id="reliability"
        title="Reliability checklist"
        description="These are the failure modes the architecture exists to eliminate. Each one has a test."
      >
        <Accordion
          items={[
            {
              id: "race",
              title: "No stale overwrite",
              content:
                "Two rapid calls to the same key: only the second response is stored. The first is aborted.",
            },
            {
              id: "unmount",
              title: "Last subscriber aborts after a tick",
              content:
                "Unmounting mid-fetch does not throw and does not write. If it was the last subscriber, abort is delayed by a tick so a remount can reuse the in-flight request.",
            },
            {
              id: "rollback",
              title: "Failed optimistic mutate rolls back",
              content:
                "The previous CacheEntry is restored exactly, including error state.",
            },
            {
              id: "store",
              title: "The store boundary is real",
              content:
                "Store tests pass with the coordinator and plugins entirely absent from the import graph.",
            },
            {
              id: "shake",
              title: "Unused plugins tree-shake",
              content:
                "Importing only useSteddy produces a bundle with no focus, reconnect, polling, retry, or TTL eviction code.",
            },
            {
              id: "evict",
              title: "Eviction never drops live work",
              content:
                "ttlEvict only deletes unused keys. In-flight requests and mounted subscribers stay.",
            },
          ]}
        />
      </Section>

      <Section
        id="v1"
        title="What used to be out of v1"
        description="These stayed out of the store. They are helpers, hook options, and plugins on top of the same one-way layers."
      >
        <Grid cols={cols} gap={6}>
          <Card title="Keep previous data" description="{ keepPreviousData: true } keeps the last value on screen while a new key loads. isLoading stays false; isValidating is true." />
          <Card title="SSR / RSC" description="createRuntime + dump + hydrateAll. Pass cache into SteddyProvider on the client so the first paint matches the server." />
          <Card title="Suspense" description="{ suspense: true } throws the shared in-flight waiter, then throws the stored error. Data already in cache does not suspend." />
          <Card title="Pagination" description="useSteddyInfinite stores each page under its own key. mutate writes every page. getKey stops if a later page would reuse an earlier key." />
          <Card title="Cache eviction" description="ttlEvict(maxAge, maxKeys) is a plugin. It never evicts in-flight or subscribed keys." />
        </Grid>
      </Section>

      <Section title="Compared with SWR">
        <Table>
          <thead>
            <tr>
              <th>Concern</th>
              <th>SWR</th>
              <th>Steddy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>In-flight same key</td>
              <td>Can race to the cache</td>
              <td>Latest generation wins; older is aborted</td>
            </tr>
            <tr>
              <td>Revalidation triggers</td>
              <td>In the core hook by default</td>
              <td>Opt-in plugins</td>
            </tr>
            <tr>
              <td>Optimistic mutate</td>
              <td>Easy to leave a dirty cache</td>
              <td>Rollback on by default</td>
            </tr>
            <tr>
              <td>Keys</td>
              <td>Functions, implicit hashing</td>
              <td>String or explicit tuple, serialized once</td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <Callout variant="info" title="npm install steddy">
        The library lives at{" "}
        <Link href="https://github.com/Cincinnatus101010/steddy">
          Cincinnatus101010/steddy
        </Link>
        . This site is the explainer, not the package.
      </Callout>

      <List>
        <ListItem>
          Layer rules for agents: keep dependency direction one-way. Never add
          fetching to the store.
        </ListItem>
        <ListItem>
          Errors stay <Code>unknown</Code>. Steddy does not wrap fetcher
          rejections.
        </ListItem>
        <ListItem>
          Built against{" "}
          <Link href="https://react.dev/reference/react/useSyncExternalStore">
            useSyncExternalStore
          </Link>
          .
        </ListItem>
      </List>
    </Stack>
  );
}
