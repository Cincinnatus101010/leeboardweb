import {
  Button,
  Code,
  CodeBlock,
  CopyButton,
  Hero,
  Link,
  Section,
  Stack,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Typography,
} from "@iantroisi/ui";
import { BenchDemo } from "./BenchDemo";
import { RaceDemo } from "./RaceDemo";
import { hookSample, measureSample } from "./samples";

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
                document.getElementById("bench")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Run benches
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                document.getElementById("api")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Read the API
            </Button>
          </>
        }
      />

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

      <Typography tone="muted">
        <Code>npm install steddy</Code> ·{" "}
        <Link href="https://github.com/Cincinnatus101010/steddy">
          Cincinnatus101010/steddy
        </Link>
        · <Code>npm run bench</Code> in the repo
      </Typography>
    </Stack>
  );
}
