import typePatcherFactory from "./typePatcherFactory";
import { TypeDefinitions } from "./types";

export default function typePatcher(typeDefinitions: TypeDefinitions) {
  return typePatcherFactory(typeDefinitions);
}
