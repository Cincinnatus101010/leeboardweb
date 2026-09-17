import {
  Code,
  CodeBlock,
  CopyButton,
  Hero,
  Link,
  Section,
  Stack,
  Typography,
} from "@iantroisi/ui";
import { Link as RouterLink } from "react-router-dom";
import { DOC_SECTIONS } from "./docsContent";
import { hookSample, measureSample, setupSample } from "./samples";

export function DocsPage() {
  return (
    <Stack gap={8}>
      <Hero
        eyebrow="Reference"
        title="Steddy docs"
        description="Setup, layers, hook options, SSR, and plugins. For demos and benchmarks, use the explainer home page."
        actions={
          <RouterLink to="/" className="site-router-link">
            ← Explainer
          </RouterLink>
        }
      />

      <nav className="site-docs-toc" aria-label="On this page">
        <Typography variant="small" tone="muted">
          Jump:{" "}
          {DOC_SECTIONS.map((section, index) => (
            <span key={section.id}>
              {index > 0 ? " · " : null}
              <a href={`#${section.id}`}>{section.title}</a>
            </span>
          ))}
        </Typography>
      </nav>

      {DOC_SECTIONS.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          <Typography as="p" className="site-docs-body">
            {section.body}
          </Typography>
          {section.id === "setup" ? (
            <SampleBlock code={setupSample} />
          ) : null}
          {section.id === "hook" ? <SampleBlock code={hookSample} /> : null}
          {section.id === "plugins" ? (
            <Stack gap={2}>
              <Typography tone="muted">
                <Code>measurePerf</Code>:
              </Typography>
              <SampleBlock code={measureSample} />
            </Stack>
          ) : null}
          {section.id === "mcp" ? (
            <Stack gap={2}>
              <SampleBlock
                code={`{
  "mcpServers": {
    "steddy": {
      "command": "node",
      "args": ["/path/to/steddy/mcp/dist/index.js"]
    }
  }
}`}
              />
              <Typography variant="small" tone="muted">
                Build: <Code>cd mcp && npm ci && npm run build</Code> in the{" "}
                <Link href="https://github.com/Cincinnatus101010/steddy">
                  steddy
                </Link>{" "}
                repo. See <Code>mcp/README.md</Code>.
              </Typography>
            </Stack>
          ) : null}
        </Section>
      ))}
    </Stack>
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
