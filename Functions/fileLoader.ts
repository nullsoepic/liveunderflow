const { glob } = require('glob');
const { promisify } = require('util');
const globbify = promisify(glob)

export async function loadFiles(dirName: string) {
    const Files = await globbify(`${process.cwd().replace(/\\/g, '/')}/${dirName}/**/*.ts`);
    Files.forEach((file) => delete require.cache[require.resolve(file)]);
    return Files;
};