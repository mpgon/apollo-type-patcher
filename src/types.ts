export interface TypeDefinitions {
  [key: string]: {
    [key: string]: any;
  };
}

export type FieldTypeMap = Array<{ field: string; type: string }>;

type TypePatcherFunction = (
  data: any,
  outerType?: string | null,
  patchDeeper?: any,
  pathAccumulator?: string
) => void;

export interface TypePatcher {
  self: () => TypePatcher;
  [key: string]: TypePatcherFunction;
}
