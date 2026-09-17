import {
  Button,
  Code,
  CodeBlock,
  CopyButton,
  Hero,
  Link,
  Panel,
  Section,
  Stack,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Typography,
} from "@iantroisi/ui";
import { Link as RouterLink } from "react-router-dom";
import { BenchDemo } from "./BenchDemo";
import { FirstUseDemo } from "./FirstUseDemo";
import { RaceDemo } from "./RaceDemo";
import { hookSample, measureSample, setupSample } from "./samples";

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
  return (
    <Stack gap={8}>
      <Hero
        id="top"
        eyebrow="React data fetching"
        title="A fetch layer that cannot roll"
        description="Stale-while-revalidate, split so a stale response cannot overwrite a fresher one. Dedup, abort, and plugins stay out of the store."
        actions={
          <>
            <Button
              onClick={() =>
                document.getElementById("try")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Try it
            </Button>
            <RouterLink to="/docs/api" className="site-docs-cta">
              API reference
            </RouterLink>
          </>
        }
      />

      <Section
        id="try"
        title="List, profile, mutate"
        description="A SteddyProvider, one key for the list, a tuple key for the profile. Save writes both cache entries. Switching users keeps the last name on screen."
      >
        <FirstUseDemo />
      </Section>

      <Section
        id="abort"
        title="Abort, don’t race"
        description="Two revalidates for the same key: the first is aborted. Only the second value is written."
      >
        <RaceDemo />
      </Section>

      <Section
        id="bench"
        title="Measure it"
        description="These numbers come from the real coordinator, not the animation above. measurePerf records the same events in your app."
      >
        <BenchDemo />
      </Section>

      <Section
        id="api"
        title="What you import"
        description="The hook is thin. Measurement is a plugin, so unused apps don’t pay for it."
      >
        <Tabs defaultValue="hook">
          <TabsList>
            <TabsTrigger value="hook">useSteddy</TabsTrigger>
            <TabsTrigger value="setup">App setup</TabsTrigger>
            <TabsTrigger value="measure">measurePerf</TabsTrigger>
          </TabsList>
          <TabsPanel value="hook">
            <Stack gap={4}>
              <Typography tone="muted">
                Pass the abort <Code>signal</Code> into <Code>fetch</Code>.{" "}
                <Code>keepPreviousData</Code> keeps the last value while a new
                key loads.
              </Typography>
              <Sample code={hookSample} />
            </Stack>
          </TabsPanel>
          <TabsPanel value="setup">
            <Stack gap={4}>
              <Typography tone="muted">
                One runtime per app (per request on the server).{" "}
                <Code>attachDefaults</Code> wires focus, reconnect, and TTL.{" "}
                <Code>prefetch</Code> warms keys before a route mounts.
              </Typography>
              <Sample code={setupSample} />
            </Stack>
          </TabsPanel>
          <TabsPanel value="measure">
            <Stack gap={4}>
              <Typography tone="muted">
                Subscribes to coordinator events. Counts starts, aborts, dedups,
                writes, errors, and elapsed <Code>totalMs</Code>.
              </Typography>
              <Sample code={measureSample} />
            </Stack>
          </TabsPanel>
        </Tabs>
      </Section>

      <Section title="Compared with waiting">
        <Table>
          <thead>
            <tr>
              <th>Concern</th>
              <th>Without Steddy</th>
              <th>Steddy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Overlapping same key</td>
              <td>Both finish; last write wins</td>
              <td>Older request is aborted</td>
            </tr>
            <tr>
              <td>Repeat within 2s</td>
              <td>Another fetch</td>
              <td>Dedup; no new request</td>
            </tr>
            <tr>
              <td>Measurement</td>
              <td>Wrap fetch yourself</td>
              <td>
                <Code>measurePerf</Code> plugin
              </td>
            </tr>
          </tbody>
        </Table>
      </Section>

      <section className="site-bottom-cta" aria-labelledby="get-started">
        <Panel padding={6} className="site-bottom-cta__panel">
          <Stack gap={4}>
            <Stack gap={2}>
              <Typography variant="h3" as="h2" id="get-started">
                Get started
              </Typography>
              <Typography tone="muted">
                Install the package, read the API reference, or clone the repo to
                run benchmarks locally.
              </Typography>
            </Stack>
            <div className="site-api-code-panel site-bottom-cta__install">
              <div className="site-api-code-panel__bar">
                <Code>npm install steddy@0.1.3</Code>
                <CopyButton
                  value="npm install steddy@0.1.3"
                  label="Copy"
                  copiedLabel="Copied"
                />
              </div>
            </div>
            <Stack direction="row" gap={3} className="site-bottom-cta__links">
              <RouterLink to="/docs/api" className="site-docs-cta">
                API reference
              </RouterLink>
              <Link
                href="https://github.com/Cincinnatus101010/steddy"
                className="site-docs-cta"
              >
                GitHub
              </Link>
              <Link
                href="https://www.npmjs.com/package/steddy"
                className="site-docs-cta site-docs-cta--primary"
              >
                npm
              </Link>
            </Stack>
          </Stack>
        </Panel>
      </section>
    </Stack>
  );
}
