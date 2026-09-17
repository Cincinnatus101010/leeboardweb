export const hookSample = `import { useSteddy } from "steddy";

function Profile({ id }: { id: string }) {
  const { data, error, isLoading, isValidating, mutate } = useSteddy(
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
  return (
    <div>
      <h1>{data.name}</h1>
      <button onClick={() => mutate({ ...data, name: "Ada" })}>
        Rename
      </button>
      {isValidating ? <small>Refreshing…</small> : null}
    </div>
  );
}`;

export const mutateSample = `import { mutate } from "steddy";

await mutate("user", (current) => ({ ...current, name: "Ada" }), {
  revalidate: true,
  rollbackOnError: true,
});`;

export const pluginSample = `import {
  defaultCoordinator,
  focusRevalidate,
  reconnectRevalidate,
  pollingRevalidate,
  retryOnError,
  ttlEvict,
} from "steddy";

const stopFocus = focusRevalidate(defaultCoordinator);
const stopReconnect = reconnectRevalidate(defaultCoordinator);
const stopPoll = pollingRevalidate(defaultCoordinator, "user", 30_000);
const stopTtl = ttlEvict(defaultCoordinator, { maxAge: 60_000, maxKeys: 200 });

const fetchUser = retryOnError(defaultCoordinator, {
  attempts: 3,
  backoff: 200,
})(getUser);`;

export const extraSample = `import { createRuntime, dump, useSteddy } from "steddy";
import { useSteddyInfinite } from "steddy";

const runtime = createRuntime();
// Server: fetch, hydrate, dump, pass cache to the client provider.
const cache = dump(runtime.store);

const { data } = useSteddy("user", getUser, { suspense: true });

const pages = useSteddyInfinite(
  (index, prev) => (prev ? ["feed", prev.next] : ["feed", 0]),
  getPage,
);

// Writes every page. Collection stops if getKey repeats a serialized key.
await pages.mutate((current) => current ?? [], { revalidate: false });`;
