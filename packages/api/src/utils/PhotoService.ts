import { FileService } from "./FileService";
import { injectable } from "tsyringe";

@injectable()
class PhotoService {
  constructor(private fileService: FileService) {}
  getPhotoFromPath = async (photoPath: string) => {
    if (!photoPath || photoPath === "") return "";
    try {
      return await this.fileService.asyncReadFile(photoPath);
    } catch (_) {
      return "";
    }
  };
}

export { PhotoService };
