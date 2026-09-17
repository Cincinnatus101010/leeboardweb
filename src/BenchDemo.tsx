import { Button, Grid, Panel, Stack, Stat, Table, Typography, useMediaQuery } from "@iantroisi/ui";
import { useState } from "react";
import { runBenches, type BenchResult } from "./benches";

function formatMs(ms: number): string {
  if (ms < 1) {
    return "<1ms";
  }
  return `${Math.round(ms)}ms`;
}

export function BenchDemo() {
  const compact = useMediaQuery("(max-width: 47.99rem)", false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<BenchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      setResults(await runBenches());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Bench failed");
    } finally {
      setRunning(false);
    }
  }

  const abort = results?.find((row) => row.id === "abort");
  const naive = results?.find((row) => row.id === "naive");
  const dedup = results?.find((row) => row.id === "dedup");
  const saved =
    abort && naive ? Math.max(0, naive.ms - abort.ms) : undefined;

  return (
    <Panel
      title="Live timings"
      description="Runs against the published steddy coordinator in this tab. Abort should beat waiting; a second fetch inside 2s should be nearly free."
      footer={
        <Button onClick={() => void run()} disabled={running}>
          {running ? "Running…" : results ? "Run again" : "Run benches"}
        </Button>
      }
    >
      <Stack gap={6}>
      {error ? (
        <Typography>{error}</Typography>
      ) : results ? (
        <Grid cols={compact ? 1 : 3} gap={6}>
          <Stat
            label="Abort vs wait"
            value={saved == null ? "—" : formatMs(saved)}
          />
          <Stat
            label="Dedup hit"
            value={dedup ? formatMs(dedup.ms) : "—"}
          />
          <Stat
            label="Steddy abort"
            value={abort ? formatMs(abort.ms) : "—"}
          />
        </Grid>
      ) : (
        <Typography tone="muted">
          80ms slow request, 20ms fast request, 10ms later. Then a 15ms fetch
          and an immediate retry.
        </Typography>
      )}
      {results ? (
        <Table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Time</th>
              <th>What happened</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td>{formatMs(row.ms)}</td>
                <td>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
      </Stack>
    </Panel>
  );
}
