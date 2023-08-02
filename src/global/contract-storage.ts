import { createResource } from "solid-js";
import { loadStorage } from "../services/io-service";

const [storage, { refetch }] = createResource(() => loadStorage());

export { refetch as refetchStorage, storage };
