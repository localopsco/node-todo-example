import { S3Client, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'node:fs';

const s3config: S3ClientConfig = {
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
};

const bucketName = process.env.S3_BUCKET_NAME;

if (process.env.NODE_ENV === 'development') {
  s3config.endpoint = process.env.MINO_ENDPOINT;
  s3config.forcePathStyle = true; // Required for Minio
}

const s3Client = new S3Client(s3config);

export const uploadFile = async (filePath: string, key: string): Promise<string | undefined> => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await upload.done();
    console.log(`File uploaded successfully. ${key}`);
    return result.Location;
  } catch (err) {
    console.error('Error uploading file:', err);
  }
};

export const deleteFile = async (key: string): Promise<undefined> => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`File deleted successfully. ${key}`);
  } catch (err) {
    console.error('Error deleteing file:', err);
  }
};
