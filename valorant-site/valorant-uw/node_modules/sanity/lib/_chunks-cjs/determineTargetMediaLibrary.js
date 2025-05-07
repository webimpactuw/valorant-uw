"use strict";
var _internal = require("./_internal.js"), rxjs = require("rxjs");
const MINIMUM_API_VERSION = "v2025-02-19", ASPECT_FILE_EXTENSIONS = [".ts", ".js"];
async function determineTargetMediaLibrary({
  apiClient,
  output,
  prompt
}) {
  const client = apiClient().withConfig({
    apiVersion: "vX"
  }), {
    projectId
  } = client.config();
  if (typeof projectId > "u")
    throw new Error("Project id is required");
  _internal.debug("Fetching available media libraries");
  const spinner = output.spinner("Fetching available media libraries").start(), mediaLibrariesByOrganization = await rxjs.firstValueFrom(client.observable.request({
    uri: "/media-libraries",
    query: {
      projectId
    }
  }).pipe(rxjs.mergeMap((response) => response.data), rxjs.filter(({
    status
  }) => status === "active"), rxjs.groupBy(({
    organizationId
  }) => organizationId), rxjs.mergeMap((group) => rxjs.zip(rxjs.of(group.key), group.pipe(rxjs.toArray()))), rxjs.toArray()));
  return spinner.succeed("[100%] Fetching available media libraries"), prompt.single({
    message: "Select media library",
    type: "list",
    choices: mediaLibrariesByOrganization.flatMap(([organizationId, mediaLibraries]) => [new prompt.Separator(`Organization: ${organizationId}`), ...mediaLibraries.map(({
      id
    }) => ({
      value: id,
      name: id
    }))])
  });
}
exports.ASPECT_FILE_EXTENSIONS = ASPECT_FILE_EXTENSIONS;
exports.MINIMUM_API_VERSION = MINIMUM_API_VERSION;
exports.determineTargetMediaLibrary = determineTargetMediaLibrary;
//# sourceMappingURL=determineTargetMediaLibrary.js.map
