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

export const measureSample = `import { createRuntime, measurePerf } from "steddy";

const runtime = createRuntime();
const perf = measurePerf(runtime.coordinator);

await runtime.coordinator.revalidate("user", getUser);
perf.snapshot();
// { starts, aborts, dedups, writes, errors, totalMs }
perf.stop();`;
