#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const [, , pagesFolder = "./pages"] = process.argv;

const values = ["getStaticProps", "getStaticPaths"];

let doc = `
** THIS FILE IS AUTOTO-GENERATED, THAT'S RIGHT IT'S MAGIC **

°_°
`;

let where = "doc_pages";

try {
  let { dir: eleventyDirConfig } = require("./.eleventy.js");
  if ("input" in eleventyDirConfig) {
    console.log("Eleventy config found");
    where = eleventyDirConfig["input"];
  }
} catch (err) {
  console.log(err);
}

const STATIC_PATHS = "__staticPaths__";
const STATIC_PROPS = "__staticProps__";
const DESCRIPTION = "__description__";

let to_add = "";
let links = "";

function isPathDirectory(path) {
  const stats = fs.statSync(path);
  return stats.isDirectory();
}

function docgen(pagesPath, where) {
  console.log({ where });
  try {
    fs.mkdirSync(where);
  } catch (err) {
    console.log("folder exists :)");
  }

  const files = fs.readdirSync(pagesPath);
  const isRoot = pagesFolder === pagesPath;
  const namePath = isRoot ? "/" : pagesPath;

  for (let [index, file] of files.entries()) {
    let stream = "";

    const p = path.join(pagesPath, file);

    if (isPathDirectory(p)) {
      try {
        fs.mkdirSync(path.join(where, file));
      } catch (err) {
        console.log("nope");
      }
      docgen(p, path.join(where + "/" + file));
    } else {
      stream += `# ${namePath}`;
      stream += `\n ${file}`;
      fs.writeFileSync(path.join(where, path.parse(file).name + ".md"), stream);
    }
  }

  // for (let [index, file] of files.entries()) {
  //   links += `\n[${index + 1}. ${file}](/test)`;
  //   const p = path.join(pagesPath, file);
  //   try {
  //     createPage(p);
  //     const content = fs.readFileSync(p, "utf-8").split("\n");
  //     let baseV = `\n# ${path.join(pagesPath, file)}\n`;
  //     let v = baseV;
  //     for (let line of content) {
  //       if (line.includes(STATIC_PATHS)) {
  //         v += `🚚 getStaticPaths :${line.split(STATIC_PATHS)[1]}\n\n`;
  //         continue;
  //       }

  //       if (line.includes(STATIC_PROPS)) {
  //         v += `📦 getStaticProps : ${line.split(STATIC_PROPS)[1]}\n\n`;
  //       }

  //       if (line.includes(DESCRIPTION)) {
  //         v += `📝 ${line.split(DESCRIPTION)[1]}\n`;
  //       }
  //     }
  //     if (baseV === v) {
  //       v += `🤯 This page is not documented (yet).`;
  //     }
  //     to_add += v + "\n";
  //   } catch (err) {
  //     try {
  //       docgen(p, true);
  //     } catch (err2) {
  //       console.log("");
  //     }
  //   }
  // }
}
function createPage(path) {
  const content = fs.readFileSync(path, "utf-8").split("\n");
}

docgen(pagesFolder, where);
// doc = doc.replace("°_°", links + to_add);

try {
  fs.readdirSync(where);
} catch (err) {
  console.log(`No folder called "${where}", creating...`);
  fs.mkdirSync(where);
}

fs.writeFileSync(`${where}/index.md`, doc);
console.log("MD generated");

const { spawn } = require("child_process");
const { create } = require("domain");

const eleventy = spawn("npx", ["@11ty/eleventy"]);

eleventy.stdout.on("data", (data) => {
  console.log("data", data.toString());
});

eleventy.stderr.on("data", (data) => {
  console.log("err", data.toString());
});

/*

To add documentation, you can use the following comments:

• // __description__ : main description
• // __staticPaths__ : getStaticPaths
• // __staticProps__ : getStaticProps

°_°
*/
