import { promises as fsPromises } from "fs";
import { join } from "path";

export async function asyncWriteFile(filename: string, data: string) {
  const get = await fsPromises.writeFile(getFilePath(filename), data);

  if (get !== undefined) throw Error("write error");
}

export async function asyncReadFile(filename: string) {
  const contents = await fsPromises.readFile(getFilePath(filename), "utf-8");

  return contents;
}

function getFilePath(filename: string) {
  const storagePath =
    __dirname.slice(0, __dirname.lastIndexOf("/.next")) + "/public/storage";
  return join(storagePath, filename);
}
