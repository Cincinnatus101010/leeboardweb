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
import { hookSample, mutateSample, pluginSample } from "./samples";

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
        description="Skeg does the same job as useSWR — stale-while-revalidate — rebuilt so dedup, retry, mutation, and subscriptions cannot share one implicit object."
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
            Skeg’s fix is boring on purpose. Split those jobs into independent
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
        description="A skeg is the fin that keeps a hull tracking straight. Each of these layers has one job."
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
              <Code>useSkeg</Code> registers the key, asks the coordinator to
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
            other.
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
            <TabsTrigger value="hook">useSkeg</TabsTrigger>
            <TabsTrigger value="mutate">mutate</TabsTrigger>
            <TabsTrigger value="plugins">plugins</TabsTrigger>
          </TabsList>
          <TabsPanel value="hook">
            <Stack gap={4}>
              <Typography tone="muted">
                Returns <Code>data</Code>, <Code>error</Code> (
                <Code>unknown</Code>), <Code>isLoading</Code>,{" "}
                <Code>isValidating</Code>, and a key-bound <Code>mutate</Code>.
                Pass the abort signal into <Code>fetch</Code> so cancelled work
                actually stops. Import from <Code>skeg</Code>.
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
                None of these are imported by <Code>useSkeg</Code>. Attach them
                yourself, and call the returned cleanup on unmount.
              </Typography>
              <Sample code={pluginSample} />
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
              title: "Last subscriber aborts",
              content:
                "Unmounting mid-fetch does not throw and does not write. If it was the last subscriber, the in-flight request is aborted.",
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
                "Importing only useSkeg produces a bundle with no focus, reconnect, polling, or retry code.",
            },
          ]}
        />
      </Section>

      <Section
        id="v1"
        title="What v1 does not do"
        description="These can land later as plugins once the core is proven. They are not built into the store."
      >
        <Grid cols={cols} gap={6}>
          <Card title="No SSR / RSC" description="getServerSnapshot is passed only so the hook does not throw on the server. There is no payload hydration story yet." />
          <Card title="No suspense" description="The hook returns isValidating. It does not throw promises." />
          <Card title="No pagination helpers" description="Infinite lists stay out of core so the coordinator does not grow a second cache shape." />
          <Card title="No cache eviction" description="Last-subscriber unmount aborts in-flight work. Cached data stays until you clear it." />
        </Grid>
      </Section>

      <Section title="Compared with SWR">
        <Table>
          <thead>
            <tr>
              <th>Concern</th>
              <th>SWR</th>
              <th>Skeg</th>
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

      <Callout variant="info" title="npm install skeg">
        The library lives at{" "}
        <Link href="https://github.com/Cincinnatus101010/skeg">
          Cincinnatus101010/skeg
        </Link>
        . This site is the explainer, not the package.
      </Callout>

      <List>
        <ListItem>
          Layer rules for agents: keep dependency direction one-way. Never add
          fetching to the store.
        </ListItem>
        <ListItem>
          Errors stay <Code>unknown</Code>. Skeg does not wrap fetcher
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
