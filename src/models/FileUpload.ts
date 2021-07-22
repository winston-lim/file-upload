import { File } from "./file";
import { UploadedFile } from "./uploadedFile";

export interface FileUpload {
	upload: (files: File[]) => Promise<UploadedFile[]>;
}
