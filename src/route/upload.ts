import { Router, Request, Response } from "express";
import multer from "multer";
import { fileHandler } from "../middleware/fileHandler";
import { AWSS3Uploader } from "../utils/aws";
import { File } from "../models/File";

const upload = multer();

const uploadRouter = Router();

uploadRouter.post(
	"/upload-to/:bucketName",
	upload.array("files", 5),
	fileHandler,
	async (req: Request, res: Response) => {
		const bucketName = req.params.bucketName;
		const uploader = new AWSS3Uploader({
			accessKeyId: process.env.ACCESS_KEY_ID!,
			destinationBucket: bucketName,
			secretAccessKey: process.env.SECRET_ACCESS_KEY!,
		});
		try {
			const { files } = req.body as { files: File[] };
			const filesPath = await uploader.upload(files);
			res.send(filesPath);
		} catch (e) {
			res.status(400).send(e.message);
		}
	}
);

export default uploadRouter;
