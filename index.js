const fs = require("fs");
const path = require("path");

const exclusions = [
    ".git",
    "node_modules"
]

const extensions = process.argv[2]?.split(" ").filter(i => i);
const depth = process.argv[3] ? parseInt(process.argv[3]) : null;
const dirPath = process.argv[4] || __dirname;

console.log("Finding files");
const files = getFiles(dirPath);
console.log(`Reading ${files.length} files`);

let lines = 0;
let chars = 0;

for (const filePath of files) {
    const file = fs.readFileSync(filePath, "utf-8");
    lines += file.split("\n").length;
    chars += file.replace(/[^\w]/g, "").length;
};

console.log();
console.log(`
Files: ${files.length}
Lines: ${lines}
Characters: ${chars}
`.trim());

function getFiles(dirPath, currDepth = 0) {
    const files = [];

    for (const fileName of  fs.readdirSync(dirPath).filter(i => exclusions.includes(i) ? false : true)) {
        const fullPath = path.join(dirPath, fileName);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if ((depth && currDepth < depth) || depth === null) files.push(...getFiles(fullPath, currDepth + 1));
        } else {
            if (extensions?.[0] ? extensions.includes(path.extname(fullPath)) : true) files.push(fullPath);
        }
    }

    return files;
}