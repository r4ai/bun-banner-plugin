import { describe, expect, test } from "bun:test";
import { readFile, rm } from "fs/promises";
import { bannerPlugin } from "../src";

const tests = import.meta.dir;

const build = () => {
  return Bun.build({
    entrypoints: [`${tests}/hoge.ts`],
    outdir: `${tests}/dist`,
    target: "node",
    minify: true,
    plugins: [
      bannerPlugin({
        // Add banners to json files
        jsonc: ["// This is a jsonc file", "// Hello, jsonc!"],

        // Add a shebang to the top of `.ts`, `.tsx`, `.js`, `.jsx` files
        "ts|tsx|js|jsx": "#!/usr/bin/env node",
      }),
    ],
  });
};

describe("bannerPlugin", () => {
  test("should add banner to ts files", async () => {
    await rm(`${tests}/dist`, { recursive: true, force: true });
    await build();
    const hogeJs = await readFile(`${tests}/dist/hoge.js`, "utf-8");
    expect(hogeJs).toBe('#!/usr/bin/env node\nconsole.log("Hello, world!");\n');
  });
});
