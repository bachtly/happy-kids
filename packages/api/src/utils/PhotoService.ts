import type { FileServiceInterface } from "./FileService";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";

interface PhotoServiceInterface {
  getPhotoFromPath: (photoPath: string) => Promise<string>;
  storePhoto: (photoB64: string, folderPath: string) => string;
}
@injectable()
class PhotoService implements PhotoServiceInterface {
  constructor(
    @inject("FileService") private fileService: FileServiceInterface
  ) {}
  getPhotoFromPath = async (photoPath: string) => {
    if (!photoPath || photoPath === "") return "";

    try {
      if (photoPath.endsWith(".png")) {
        return await this.fileService.readFileBase64(photoPath);
      } else {
        return await this.fileService.asyncReadFile(photoPath);
      }
    } catch (_) {
      return "";
    }
  };

  /**
   * @param photoB64 photo in base64
   * @param folderPath folder to store
   * @returns photoPath when writing photoB64 to file
   */
  storePhoto = (photoB64: string, folderPath: string) => {
    if (photoB64 === "") return "";
    const filename = join(folderPath, uuidv4());
    this.fileService
      .asyncWriteFile(filename, photoB64)
      .catch((e: Error) =>
        console.log(`failed to write to file ${filename}, error`, e.message)
      );
    return filename;
  };
}

export { PhotoService };
export type { PhotoServiceInterface };
