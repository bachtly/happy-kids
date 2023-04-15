import { asyncReadFile } from "./fileIO";

class PhotoService {
  static getPhotoFromPath = async (photoPath: string) => {
    if (!photoPath || photoPath === "") return "";
    try {
      return await asyncReadFile(photoPath);
    } catch (_) {
      return "";
    }
  };
}

export { PhotoService };
