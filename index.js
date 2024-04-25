const fs = require("fs");
const path = require("path");

const exclusions = [
    ".git",
    "node_modules"
]

const extensions = process.argv[2]?.split(" ").filter(i => i);
const depth = process.argv[3] ? Number(process.argv[3]) : null;
const dirPath = process.argv[4] || __dirname;

console.log("Finding files");
const files = getFiles(dirPath);
// console.log(files);
console.log(`Reading ${files.length} files`);

let lines = 0;
let chars = 0;

files.forEach(filePath => {
    const file = fs.readFileSync(filePath, "utf-8");
    lines += file.split("\n").length;
    chars += file.length;
});

console.log();
console.log(`
Files: ${files.length}
Lines: ${lines}
Characters: ${chars}
`.trim());

function getFiles(dirPath, currDepth = 0) {
    const files = [];

    fs.readdirSync(dirPath)
        .filter(i => exclusions.includes(i) ? false : true)
        .forEach(fileName => {
            const joinedPath = path.join(dirPath, fileName);
            if (fs.lstatSync(joinedPath).isDirectory()) {
                if ((typeof depth == "number" && currDepth < depth) || typeof depth != "number")
                    files.push(...getFiles(joinedPath, currDepth + 1));
            } else {
                if (extensions?.[0] ? extensions.includes(path.extname(joinedPath)) : true) files.push(joinedPath);
            }
        });

    return files;
}