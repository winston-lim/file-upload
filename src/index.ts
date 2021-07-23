import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

require("dotenv").config();

const app = express();
AWS.config = new AWS.Config();
AWS.config.update({
	region: "ap-southeast-1",
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID!,
		secretAccessKey: process.env.SECRET_ACCESS_KEY!,
	},
});
const s3 = new AWS.S3();

const upload = multer({
	storage: multerS3({
		s3,
		bucket: "winston-file-upload",
		acl: "public-read",
		metadata: function (
			req: Request,
			file: Express.Multer.File,
			cb: (error: any, key?: string | undefined) => void
		) {
			cb(null, Object.assign({}, req.body));
		},
		key: function (
			req: Request,
			file: Express.Multer.File,
			cb: (error: any, key?: string | undefined) => void
		) {
			cb(null, `${req.params.id}/${file.originalname}`);
		},
	}),
});

app.use(cors());
app.use(express.json());

app.post(
	"/upload/:id",
	upload.array("files", 5),
	async (req: Request, res: Response) => {
		const { files } = req;
		const paths = (files as any).map((file: any) => file.location);
		res.send(paths);
	}
);

app.listen(5001, () => {
	console.log("File upload server started on 5001");
});
