import { File } from "./file";
import { UploadedFile } from "./uploadedFile";

export interface FileUploader {
	upload: (
		files: File | File[]
	) => Promise<UploadedFile | UploadedFile[] | undefined>;
}
