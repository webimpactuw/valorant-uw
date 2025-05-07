"use strict";
var path = require("node:path");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var path__default = /* @__PURE__ */ _interopDefaultCompat(path);
function withMediaLibraryConfig(context) {
  const {
    cliConfig,
    cliConfigPath
  } = context, mediaLibrary = typeof cliConfig == "object" && "mediaLibrary" in cliConfig ? cliConfig.mediaLibrary : void 0, relativeConfigPath = path__default.default.relative(process.cwd(), cliConfigPath ?? "");
  if (typeof mediaLibrary?.aspectsPath > "u")
    throw new Error(`${relativeConfigPath} does not contain a media library aspects path ("mediaLibrary.aspectsPath"), which is required for the Sanity CLI to manage aspects.`);
  return {
    ...context,
    mediaLibrary
  };
}
exports.withMediaLibraryConfig = withMediaLibraryConfig;
//# sourceMappingURL=withMediaLibraryConfig.js.map
