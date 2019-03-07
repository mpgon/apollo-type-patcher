import typePatcherFactory from "./factory";

export default function typePatcher(typedef: any): any {
  return typePatcherFactory(typedef);
}
