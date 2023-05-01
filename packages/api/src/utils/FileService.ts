import { promises as fsPromises } from "fs";
import { join } from "path";
import { injectable } from "tsyringe";
import { SYSTEM_ERROR_MESSAGE } from "./errorHelper";

interface FileServiceInterface {
  asyncWriteFile: (filename: string, data: string) => Promise<void>;
  asyncReadFile: (filename: string) => Promise<string>;
  readFileBase64: (filename: string) => Promise<string>;
}

@injectable()
class FileService implements FileServiceInterface {
  readFileBase64 = async (filename: string) => {
    const contents = await fsPromises
      .readFile(this.getFilePath(filename), {
        encoding: "base64"
      })
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });
    return contents;
  };

  asyncWriteFile = async (filename: string, data: string) => {
    const get = await fsPromises
      .writeFile(this.getFilePath(filename), data)
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    if (get !== undefined) throw Error("write error");
  };

  asyncReadFile = async (filename: string) => {
    const contents = await fsPromises
      .readFile(this.getFilePath(filename), "utf-8")
      .catch((err: Error) => {
        console.log(err);
        throw SYSTEM_ERROR_MESSAGE;
      });

    return contents;
  };

  private getFilePath = (filename: string) => {
    const idxOfNext = __dirname.lastIndexOf("/.next");
    if (idxOfNext !== -1) {
      // running inside next
      const storagePath = __dirname.slice(0, idxOfNext) + "/public/storage";
      return join(storagePath, filename);
    } else {
      // running inside api
      return join(
        __dirname,
        "../../../../apps/nextjs/public/storage",
        filename
      );
    }
  };
}

export { FileService };

export type { FileServiceInterface };
