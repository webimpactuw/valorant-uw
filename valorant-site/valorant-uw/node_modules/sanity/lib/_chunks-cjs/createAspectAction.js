"use strict";
var fs = require("node:fs/promises"), path = require("node:path"), idUtils = require("@sanity/id-utils"), camelCase = require("lodash/camelCase.js"), withMediaLibraryConfig = require("./withMediaLibraryConfig.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var fs__default = /* @__PURE__ */ _interopDefaultCompat(fs), path__default = /* @__PURE__ */ _interopDefaultCompat(path), camelCase__default = /* @__PURE__ */ _interopDefaultCompat(camelCase);
const createAspectAction = async (args, context) => {
  const {
    output,
    chalk,
    prompt,
    mediaLibrary
  } = withMediaLibraryConfig.withMediaLibraryConfig(context), title = await prompt.single({
    message: "Title",
    type: "input"
  }), name = await prompt.single({
    message: "Name",
    type: "input",
    default: idUtils.createPublishedId(camelCase__default.default(title))
  }), safeName = idUtils.createPublishedId(camelCase__default.default(name)), destinationPath = path__default.default.resolve(mediaLibrary.aspectsPath, `${safeName}.ts`), relativeDestinationPath = path__default.default.relative(process.cwd(), destinationPath);
  if (await fs__default.default.mkdir(path__default.default.resolve(mediaLibrary.aspectsPath), {
    recursive: !0
  }), await fs__default.default.stat(destinationPath).then(() => !0).catch(() => !1)) {
    output.error(`A file already exists at ${chalk.bold(relativeDestinationPath)}`);
    return;
  }
  await fs__default.default.writeFile(destinationPath, template({
    name: safeName,
    title
  })), output.success(`Aspect created! ${chalk.bold(relativeDestinationPath)}`), output.print(), output.print("Next steps:"), output.print(`Open ${chalk.bold(relativeDestinationPath)} in your code editor and customize the aspect.`), output.print(), output.print("Deploy this aspect by running:"), output.print(chalk.bold(`sanity media deploy-aspect ${safeName}`)), output.print(), output.print("Deploy all aspects by running:"), output.print(chalk.bold("sanity media deploy-aspect --all"));
};
function template({
  name,
  title
}) {
  return `import {defineAssetAspect, defineField} from 'sanity'

export default defineAssetAspect({
  name: '${name}',
  title: '${title}',
  type: 'object',
  fields: [
    defineField({
      name: 'string',
      title: 'Plain String',
      type: 'string',
    }),
  ],
})
`;
}
exports.default = createAspectAction;
//# sourceMappingURL=createAspectAction.js.map
