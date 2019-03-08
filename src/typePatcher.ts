import typePatcherFactory from "./typePatcherFactory";

export default function typePatcher(typeDefinition: any) {
  return typePatcherFactory(typeDefinition);
}
