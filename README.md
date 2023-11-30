# bun-banner-plugin

A small plugin to insert an arbitrary string at the beginning of generated content. Inspired by [esbuild banner option](https://esbuild.github.io/api/#banner).

## Installation

```sh
bun add -D bun-npm-package
```

## Usage

`build.ts`:

```ts
import { bannerPlugin } from "bun-banner-plugin";

await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
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
```

## Example

Suppose you have the following `src/index.ts`.

```ts
console.log("Hello, world!");
```

Now, using the `build.ts` I wrote in [Usage](#usage), run `bun run build.ts`, the following will be output:

```js
#!/usr/bin/env node
console.log("Hello, world!");
```

## Options

- The key is a regular expression that matches the file extension.
  - The given key is interpreted as a regular expression, so you need to escape special characters.
  - For example:
    - If the key is `json`, it will interpreted as `/.(json)$/`. It will match `.json` files.
    - If the key is `ts|tsx|js|jsx`, it will iterpreted as `/.(ts|tsx|js|jsx)$/`. It will match `.ts`, `.tsx`, `.js`, `.jsx` files.
- The value is the string to be inserted at the beginning of the file.
  - If the value is an array, the strings in the array will be joined with a newline character.
  - If the value is a string, it will be inserted as is.
  - For example, If the value is `["// This is a jsonc file", "// Hello, jsonc!"]`, it will be inserted as follows:

    ```jsonc
    // This is a jsonc file
    // Hello, jsonc!
    {
      "foo": "bar",
    }
    ```

## Development

### Commands

| Command                       | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `bun install`                 | Install dependencies                              |
| `bun run build`               | Build the project                                 |
| `bun run test`                | Run tests with watch mode                         |
| `bun run check`               | Lint and format                                   |
| `npm publish --dry-run`       | Check locally for products to be published to npm |
| `npm publish --access public` | Publish to npm                                    |

### Publish

1. Update version in `package.json`
2. commit with tag `vX.X.X`
3. push to GitHub
