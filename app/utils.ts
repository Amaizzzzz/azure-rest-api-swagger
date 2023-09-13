import { IApiOption, apiOptions } from "./transform-data";

export function findApi(api?: string) {
  if (!api) return null;
  return apiOptions.find((it) => it.label === api);
}

export function findApiVersion(apiOption?: IApiOption, version?: string) {
  if (!apiOption) return null;
  if (!version) return apiOption.value.versions?.[0];
  return apiOption.value.versions.find((it) => it.label === version);
}
