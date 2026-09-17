import { createCoordinator, createStore } from "steddy";

export type BenchResult = {
  id: string;
  label: string;
  ms: number;
  detail: string;
};

function timeoutDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (!signal) {
      return;
    }
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (typeof Worker === "undefined") {
    return timeoutDelay(ms, signal);
  }
  return new Promise((resolve, reject) => {
    const blob = new Blob(
      [
        "onmessage=(e)=>{const n=performance.now()+e.data;while(performance.now()<n);postMessage(0)}",
      ],
      { type: "text/javascript" },
    );
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    let done = false;
    const finish = (cb: () => void) => {
      if (done) {
        return;
      }
      done = true;
      worker.terminate();
      URL.revokeObjectURL(url);
      cb();
    };
    const onAbort = () => {
      finish(() => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    };
    worker.onmessage = () => finish(resolve);
    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
    worker.postMessage(ms);
  });
}

async function time(run: () => Promise<unknown>): Promise<number> {
  const started = performance.now();
  await run();
  return performance.now() - started;
}

const SLOW_MS = 80;
const FAST_MS = 20;
const STAGGER_MS = 10;
const FETCH_MS = 15;

export async function runBenches(): Promise<BenchResult[]> {
  const abortMs = await time(async () => {
    const coordinator = createCoordinator(createStore());
    const slow = coordinator.revalidate("user", async (_key, { signal }) => {
      await delay(SLOW_MS, signal);
      return "slow";
    });
    await delay(STAGGER_MS);
    await coordinator.revalidate("user", async (_key, { signal }) => {
      await delay(FAST_MS, signal);
      return "fast";
    });
    await slow;
  });

  const naiveMs = await time(async () => {
    const slow = delay(SLOW_MS).then(() => "slow");
    await delay(STAGGER_MS);
    const fast = delay(FAST_MS).then(() => "fast");
    await Promise.all([slow, fast]);
  });

  const coordinator = createCoordinator(createStore());
  const coldMs = await time(() =>
    coordinator.revalidate("user", async () => {
      await delay(FETCH_MS);
      return "ok";
    }),
  );
  const dedupMs = await time(() =>
    coordinator.revalidate("user", async () => {
      await delay(FETCH_MS);
      return "again";
    }),
  );

  return [
    {
      id: "abort",
      label: "Steddy abort",
      ms: abortMs,
      detail: "Slow then fast on one key. Only the fast write lands.",
    },
    {
      id: "naive",
      label: "No abort",
      ms: naiveMs,
      detail: "Same overlap, wait for both.",
    },
    {
      id: "cold",
      label: "Cold fetch",
      ms: coldMs,
      detail: "First write of a 15ms fetcher.",
    },
    {
      id: "dedup",
      label: "Dedup hit",
      ms: dedupMs,
      detail: "Second revalidate inside the 2s window.",
    },
  ];
}
