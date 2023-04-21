import { FileService } from "./FileService";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";

@injectable()
class PhotoService {
  constructor(private fileService: FileService) {}
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
