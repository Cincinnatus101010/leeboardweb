import {
  Badge,
  Button,
  Panel,
  Progress,
  Stack,
  Typography,
} from "@iantroisi/ui";
import { useEffect, useRef, useState } from "react";

type RacePhase = "idle" | "running" | "done";

export function RaceDemo() {
  const [phase, setPhase] = useState<RacePhase>("idle");
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [aborted, setAborted] = useState(false);
  const [store, setStore] = useState<string>("—");
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function finish() {
    setProgressA(40);
    setProgressB(100);
    setAborted(true);
    setStore('"second"');
    setPhase("done");
  }

  function run() {
    if (frame.current != null) cancelAnimationFrame(frame.current);
    setPhase("running");
    setProgressA(0);
    setProgressB(0);
    setAborted(false);
    setStore("—");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      finish();
      return;
    }

    const started = performance.now();
    const tick = (now: number) => {
      const elapsed = now - started;
      setProgressA(Math.min(100, (elapsed / 2000) * 100));
      if (elapsed >= 400) {
        setProgressB(Math.min(100, ((elapsed - 400) / 400) * 100));
      }
      if (elapsed >= 800) {
        finish();
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  return (
    <Panel
      title="Two requests, one key"
      description="A slow request starts, then a faster one for the same key. Steddy aborts the first. Only the second value is written."
      footer={
        <Button onClick={run} disabled={phase === "running"}>
          {phase === "idle"
            ? "Run the race"
            : phase === "running"
              ? "Racing…"
              : "Run again"}
        </Button>
      }
    >
      <Stack gap={6}>
        <div className="site-lane">
          <Stack direction="row" gap={2} align="center">
            <Typography variant="small">Request A · slow</Typography>
            {aborted ? <Badge variant="warning">aborted</Badge> : null}
          </Stack>
          <Progress value={progressA} max={100} aria-label="Slow request" />
        </div>
        <div className="site-lane">
          <Stack direction="row" gap={2} align="center">
            <Typography variant="small">Request B · fast</Typography>
            {phase === "done" ? (
              <Badge variant="success">written</Badge>
            ) : null}
          </Stack>
          <Progress value={progressB} max={100} aria-label="Fast request" />
        </div>
        <Typography variant="small" tone="muted">
          store["user"] = <code>{store}</code>
        </Typography>
      </Stack>
    </Panel>
  );
}
