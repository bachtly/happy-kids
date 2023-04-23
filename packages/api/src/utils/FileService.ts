import { promises as fsPromises } from "fs";
import { join } from "path";
import { injectable } from "tsyringe";

interface FileServiceInterface {
  asyncWriteFile: (filename: string, data: string) => Promise<void>;
  asyncReadFile: (filename: string) => Promise<string>;
  readFileBase64: (filename: string) => Promise<string>;
}

@injectable()
class FileService implements FileServiceInterface {
  readFileBase64 = async (filename: string) => {
    const contents = await fsPromises.readFile(this.getFilePath(filename), {
      encoding: "base64"
    });
    return contents;
  };

  asyncWriteFile = async (filename: string, data: string) => {
    const get = await fsPromises.writeFile(this.getFilePath(filename), data);

    if (get !== undefined) throw Error("write error");
  };

  asyncReadFile = async (filename: string) => {
    const contents = await fsPromises.readFile(
      this.getFilePath(filename),
      "utf-8"
    );
    return contents;
  };

  private getFilePath = (filename: string) => {
    const storagePath =
      __dirname.slice(0, __dirname.lastIndexOf("/.next")) + "/public/storage";
    return join(storagePath, filename);
  };
}

export { FileService };

export type { FileServiceInterface };
