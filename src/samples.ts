export const hookSample = `import { useSkeg } from "skeg";

function Profile({ id }: { id: string }) {
  const { data, error, isLoading, isValidating, mutate } = useSkeg(
    ["user", id],
    async ([, userId], { signal }) => {
      const response = await fetch(\`/api/users/\${userId}\`, { signal });
      if (!response.ok) throw new Error("failed");
      return response.json();
    },
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

export const mutateSample = `import { mutate } from "skeg";

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
} from "skeg";

const stopFocus = focusRevalidate(defaultCoordinator);
const stopReconnect = reconnectRevalidate(defaultCoordinator);
const stopPoll = pollingRevalidate(defaultCoordinator, "user", 30_000);

const fetchUser = retryOnError(defaultCoordinator, {
  attempts: 3,
  backoff: 200,
})(getUser);`;
