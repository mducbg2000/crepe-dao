import { createResource } from "solid-js";
import { loadStorage } from "../services/contract-service";


const [storage, {refetch}] = createResource(() => loadStorage());

export {storage, refetch as refetchStorage}