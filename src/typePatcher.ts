import { typePatcherFactory } from "./typePatcherFactory";
import { TypeDefinitions } from "./types";

export function typePatcher(typeDefinitions: TypeDefinitions) {
    return typePatcherFactory(typeDefinitions);
}
