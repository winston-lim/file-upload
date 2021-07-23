import AWS from "aws-sdk";
import stream from "stream";
import { File } from "../models/File";
import { UploadedFile } from "../models/UploadedFile";

type S3UploadConfig = {
	accessKeyId: string;
	secretAccessKey: string;
	destinationBucket: string;
	region?: string;
};

type S3UploadStream = {
	writeStream: stream.PassThrough;
	promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader {
	private s3: AWS.S3;
	public config: S3UploadConfig;

	constructor(config: S3UploadConfig) {
		AWS.config = new AWS.Config();
		AWS.config.update({
			region: config.region || "ap-southeast-1",
			credentials: {
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey,
			},
		});
		this.s3 = new AWS.S3({ apiVersion: "2006-03-01" });
		this.config = config;
	}

	private createDesintationFilePath(file: File, detail: string) {
		return `${file.name}-${detail}.${file.extension}`;
	}

	private createUploadStream(key: string): S3UploadStream {
		const pass = new stream.PassThrough();
		return {
			writeStream: pass,
			promise: this.s3
				.upload({
					Bucket: this.config.destinationBucket,
					Key: key,
					Body: pass,
				})
				.promise(),
		};
	}

	async uploadFile(file: File, detail?: string) {
		let fileDetail = detail;
		if (!detail) {
			fileDetail = Date.now().toString();
		}
		const filePath = this.createDesintationFilePath(file, fileDetail!);
		await this.s3.putObject({
			Bucket: this.config.destinationBucket,
			Key: filePath,
			ContentType: file.type,
			Body: file.content,
		});
		return `${this.config.destinationBucket}/${filePath}`;
	}

	async upload(
		files: File | File[]
	): Promise<UploadedFile | UploadedFile[] | undefined> {
		try {
			if (Array.isArray(files)) {
				const paths = await Promise.all(
					files.map(async (file) => this.uploadFile(file))
				);
				return paths.map((path) => ({ path }));
			}
			const path = await this.uploadFile(files);
			return {
				path,
			};
		} catch {
			return undefined;
		}
	}
}
