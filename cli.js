#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const [, , pagesFolder = "./pages"] = process.argv;

const values = ["getStaticProps", "getStaticPaths"];

let doc = `** THIS FILE IS AUTOTO-GENERATED, THAT'S RIGHT IT'S MAGIC **

To add documentation, you can use the following comments:

      • // __description__ : main description
      • // __staticPaths__ : getStaticPaths
      • // __staticProps__ : getStaticProps

°_°`;

const STATIC_PATHS = "__staticPaths__";
const STATIC_PROPS = "__staticProps__";
const DESCRIPTION = "__description__";

let to_add = "";

function docgen(pagesPath) {
  let files = fs.readdirSync(pagesPath);
  for (let file of files) {
    const p = path.join(pagesPath, file);
    try {
      const content = fs.readFileSync(p, "utf-8").split("\n");
      let baseV = `\n# ${path.join(pagesPath, file)}\n`;
      let v = baseV;
      for (let line of content) {
        if (line.includes(STATIC_PATHS)) {
          v += `🚚 getStaticPaths :${line.split(STATIC_PATHS)[1]}\n\n`;
          continue;
        }

        if (line.includes(STATIC_PROPS)) {
          v += `📦 getStaticProps : ${line.split(STATIC_PROPS)[1]}\n\n`;
        }

        if (line.includes(DESCRIPTION)) {
          v += `📝 ${line.split(DESCRIPTION)[1]}\n`;
        }
      }
      if (baseV === v) {
        v += `🤯 This page is not documented (yet).`;
      }
      to_add += v + "\n";
    } catch (err) {
      try {
        docgen(p, true);
      } catch (err2) {
        console.log("");
      }
    }
  }
}

docgen(pagesFolder);
doc = doc.replace("°_°", to_add);

fs.writeFileSync("doc_pages.md", doc);
