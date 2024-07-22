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

let s3ClientCache: S3Client | null = null;
const getS3Client = () => {
  if (s3ClientCache) return s3ClientCache;
  s3ClientCache = new S3Client(s3config);
  return s3ClientCache;
};

export const isEnabled = () => {
  if (process.env.S3_ENABLED !== 'true') {
    console.log('Notice: S3 is disabled via flag S3_ENABLED. Set it to `true` to enable it');
    return false;
  }

  if (!process.env.S3_REGION) {
    console.error('Notice: Region is missing. Skipping initialization');
    return false;
  }

  if (!bucketName) {
    console.error('Notice: Bucket name is missing. Skipping initialization');
    return false;
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('Notice: Missing AWS Credentials. Skipping initialization');
    return false;
  }

  return true;
};

export const uploadFile = async (filePath: string, key: string): Promise<string | undefined> => {
  const s3Client = getS3Client();

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
  const s3Client = getS3Client();

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
