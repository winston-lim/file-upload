import { File } from "./File";
import { UploadedFile } from "./UploadedFile";

export interface FileUploader {
	upload: (
		files: File | File[]
	) => Promise<UploadedFile | UploadedFile[] | undefined>;
}
