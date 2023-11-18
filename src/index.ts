import { type BunPlugin } from "bun";

/**
 * @example
 * ```js
 * bannerPlugin({
 *   // Add a banner to json files
 *   "jsonc": ["// This is a jsonc file", "// Hello, jsonc!"],
 *
 *   // Add a shebang to the top of the entrypoint file
 *   "ts|tsx|js|jsx": "#!/usr/bin/env node",
 * })
 * ```
 */
export type bannerPluginConfig = {
  [fileExtension: string]: string | string[];
};

/**
 * Add banners to the top of files.
 * @example
 * ```js
 * import { bannerPlugin } from "./bannerPlugin";
 *
 * await Bun.build({
 *   entrypoints: ["src/index.ts"],
 *   outdir: "dist",
 *   target: "node",
 *   plugins: [
 *     bannerPlugin({
 *       "ts|tsx|js|jsx": "#!/usr/bin/env node",
 *     }),
 *   ],
 * });
 * ```
 */
export const bannerPlugin = (_config: bannerPluginConfig): BunPlugin => {
  const config = Object.entries(_config).map(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, value.join("\n")];
    }
    return [key, value];
  });

  return {
    name: "banner",
    setup: async (build) => {
      const { readFileSync } = await import("fs");

      for (const [fileExtension, banner] of config) {
        build.onLoad(
          { filter: new RegExp(`\\.(${fileExtension})$`) },
          (args) => {
            const contents = readFileSync(args.path, "utf8");
            return {
              contents: `${banner}\n${contents}`,
              loader: args.loader,
            };
          },
        );
      }
    },
  };
};
