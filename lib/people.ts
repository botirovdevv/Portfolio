import "server-only";
import { getDb } from "./firebase-admin";

/** What Alex knows about a Telegram user, keyed by their user id. Notes are written only by the admin. */
export type Person = {
  id: string;
  notes: string | null;
  firstName: string | null;
  username: string | null;
  lastSeenAt: number | null;
};

const COLLECTION = "people";

function toPerson(id: string, data: FirebaseFirestore.DocumentData): Person {
  return {
    id,
    notes: data.notes ?? null,
    firstName: data.firstName ?? null,
    username: data.username ?? null,
    lastSeenAt: data.lastSeenAt ?? null,
  };
}

export async function getPerson(id: number | string): Promise<Person | null> {
  const doc = await getDb().collection(COLLECTION).doc(String(id)).get();
  return doc.exists ? toPerson(doc.id, doc.data()!) : null;
}

export async function rememberPerson(id: string, notes: string) {
  await getDb()
    .collection(COLLECTION)
    .doc(id)
    .set({ notes, hasNotes: true, updatedAt: Date.now() }, { merge: true });
}

/** Clears the notes but keeps the commenter record so they still show up in /people. */
export async function forgetPerson(id: string): Promise<boolean> {
  const ref = getDb().collection(COLLECTION).doc(id);
  if (!(await ref.get()).data()?.hasNotes) return false;
  await ref.set({ notes: null, hasNotes: false, updatedAt: Date.now() }, { merge: true });
  return true;
}

/** Records who commented, so the admin can find their id with /people. */
export async function touchCommenter(user: { id: number; first_name?: string; username?: string }) {
  await getDb()
    .collection(COLLECTION)
    .doc(String(user.id))
    .set(
      { firstName: user.first_name ?? null, username: user.username ?? null, lastSeenAt: Date.now() },
      { merge: true },
    );
}

export async function listPeople(recent = 15): Promise<{ known: Person[]; recent: Person[] }> {
  const col = getDb().collection(COLLECTION);
  const [known, seen] = await Promise.all([
    col.where("hasNotes", "==", true).get(),
    col.orderBy("lastSeenAt", "desc").limit(recent).get(),
  ]);
  const knownIds = new Set(known.docs.map((d) => d.id));
  return {
    known: known.docs.map((d) => toPerson(d.id, d.data())),
    recent: seen.docs.filter((d) => !knownIds.has(d.id)).map((d) => toPerson(d.id, d.data())),
  };
}
