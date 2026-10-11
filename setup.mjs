// Puts flat uploaded files into their real folders before the build.
// A file named src__app__page.tsx becomes src/app/page.tsx.
import { readdirSync, mkdirSync, renameSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
for (const name of readdirSync(root)) {
  if (!name.includes("__") || !statSync(join(root, name)).isFile()) continue;
  const target = name.split("__").map((p) => (p === "ID" ? "[id]" : p)).join("/");
  mkdirSync(dirname(join(root, target)), { recursive: true });
  renameSync(join(root, name), join(root, target));
  console.log("placed", target);
}

if (!existsSync(join(root, "src/app/page.tsx"))) {
  console.error("ERROR: src__app__page.tsx was not uploaded to the repository.");
  process.exit(1);
}
