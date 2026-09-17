import {
  Badge,
  Button,
  Card,
  Grid,
  Input,
  List,
  ListItem,
  Stack,
  Typography,
  useMediaQuery,
} from "@iantroisi/ui";
import { useEffect, useMemo, useState } from "react";
import {
  createRuntime,
  SteddyProvider,
  useSteddy,
} from "steddy";
import { createDb, type User } from "./firstUseApi";

function FirstUseApp({ db }: { db: ReturnType<typeof createDb> }) {
  const compact = useMediaQuery("(max-width: 47.99rem)", false);
  const [id, setId] = useState("ada");
  const [draft, setDraft] = useState("Ada");
  const list = useSteddy("users", db.list);
  const profile = useSteddy(["user", id], db.get, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (profile.data) {
      setDraft(profile.data.name);
    }
  }, [profile.data]);

  async function save() {
    const current = profile.data;
    if (!current || draft === current.name) {
      return;
    }
    const next: User = { ...current, name: draft };
    await profile.mutate(() => db.save(next), { revalidate: false });
    await list.mutate(
      (users) =>
        users?.map((user) => (user.id === next.id ? next : user)) ?? [next],
      { revalidate: false },
    );
  }

  return (
    <Grid cols={compact ? 1 : 2} gap={6}>
      <Card title="Users" description="One cache key for the list.">
        {list.isLoading ? (
          <Typography tone="muted">Loading…</Typography>
        ) : (
          <List>
            {list.data?.map((user) => (
              <ListItem key={user.id}>
                <Button
                  variant="ghost"
                  className="site-user-btn"
                  aria-current={user.id === id ? "true" : undefined}
                  onClick={() => setId(user.id)}
                >
                  {user.name}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Card>
      <Card
        title="Profile"
        description="A tuple key. keepPreviousData holds the last user."
      >
        <Stack gap={4}>
          <Stack direction="row" gap={2} align="center">
            <Typography variant="h3" as="h3">
              {profile.data?.name ?? "Loading…"}
            </Typography>
            {profile.isValidating ? (
              <Badge>Validating</Badge>
            ) : null}
          </Stack>
          {profile.error ? (
            <Typography>Could not load this user.</Typography>
          ) : (
            <Stack direction={compact ? "column" : "row"} gap={2}>
              <Input
                aria-label="Name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <Button
                onClick={() => void save()}
                disabled={
                  !profile.data ||
                  draft === profile.data.name ||
                  profile.isValidating
                }
              >
                Save
              </Button>
            </Stack>
          )}
        </Stack>
      </Card>
    </Grid>
  );
}

export function FirstUseDemo() {
  const runtime = useMemo(() => createRuntime(), []);
  const db = useMemo(() => createDb(), []);
  return (
    <SteddyProvider store={runtime.store} coordinator={runtime.coordinator}>
      <FirstUseApp db={db} />
    </SteddyProvider>
  );
}
