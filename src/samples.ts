export const hookSample = `import { useSteddy } from "steddy";

function Profile({ id }: { id: string }) {
  const { data, error, isLoading, mutate } = useSteddy(
    ["user", id],
    async ([, userId], { signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      if (!response.ok) throw new Error("failed");
      return response.json();
    },
    { keepPreviousData: true },
  );

  if (error) return <p>Failed to load</p>;
  if (isLoading) return <p>Loading…</p>;
  return <h1>{data.name}</h1>;
}`;

export const setupSample = `import { useEffect } from "react";
import {
  attachDefaults,
  createRuntime,
  dump,
  prefetch,
  SteddyProvider,
} from "steddy";

const runtime = createRuntime();

export function AppProviders({
  children,
  cache,
}: {
  children: React.ReactNode;
  cache?: ReturnType<typeof dump>;
}) {
  useEffect(() => attachDefaults(runtime.coordinator, runtime.store), []);
  return (
    <SteddyProvider
      store={runtime.store}
      coordinator={runtime.coordinator}
      cache={cache}
    >
      {children}
    </SteddyProvider>
  );
}

// Server: const cache = dump(serverRuntime.store);
// Client: <AppProviders cache={cache}>…</AppProviders>
// Loader: await prefetch(["user", id], fetchUser, runtime);`;

export const measureSample = `import { createRuntime, measurePerf } from "steddy";

const runtime = createRuntime();
const perf = measurePerf(runtime.coordinator);

await runtime.coordinator.revalidate("user", getUser);
perf.snapshot();
// { starts, aborts, dedups, writes, errors, totalMs }
perf.stop();`;
