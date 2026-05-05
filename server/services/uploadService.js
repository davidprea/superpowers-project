const crypto = require('crypto')
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')

let client = null

function getClient() {
  if (client) return client
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials are not configured')
  }
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  })
  return client
}

const MIME_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

function isAllowedImage(mimetype) {
  return Object.hasOwn(MIME_EXTENSIONS, mimetype)
}

async function objectExists(client, bucket, key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) return false
    throw err
  }
}

async function uploadImage({ buffer, mimetype }) {
  const bucket = process.env.R2_BUCKET
  const publicBase = process.env.R2_PUBLIC_URL
  if (!bucket || !publicBase) {
    throw new Error('R2_BUCKET and R2_PUBLIC_URL must be set')
  }

  const ext = MIME_EXTENSIONS[mimetype]
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  const key = `blog/${hash}.${ext}`
  const url = `${publicBase.replace(/\/$/, '')}/${key}`
  const client = getClient()

  if (await objectExists(client, bucket, key)) {
    return url
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  return url
}

module.exports = { uploadImage, isAllowedImage }
