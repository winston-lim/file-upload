import { File } from "./File";
import { UploadedFile } from "./UploadedFile";

export interface FileUpload {
	upload: (files: File[]) => Promise<UploadedFile[]>;
}
