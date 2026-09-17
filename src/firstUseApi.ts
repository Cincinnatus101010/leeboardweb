import type { Fetcher } from "steddy";

export type User = { id: string; name: string };

function wait(ms: number, signal?: AbortSignal): Promise<void> {
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

export function createDb() {
  const users = new Map<string, User>([
    ["ada", { id: "ada", name: "Ada" }],
    ["grace", { id: "grace", name: "Grace" }],
  ]);

  const list: Fetcher<User[]> = async (_key, { signal }) => {
    await wait(120, signal);
    return [...users.values()].map((user) => ({ ...user }));
  };

  const get: Fetcher<User> = async (key, { signal }) => {
    await wait(180, signal);
    const id = Array.isArray(key) ? String(key[1]) : String(key);
    const user = users.get(id);
    if (!user) {
      throw new Error("missing");
    }
    return { ...user };
  };

  async function save(user: User, signal?: AbortSignal): Promise<User> {
    await wait(160, signal);
    users.set(user.id, { ...user });
    return { ...user };
  }

  return { list, get, save };
}
