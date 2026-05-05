const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const { uploadImage } = require('../services/uploadService')

const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '))
  process.exit(1)
}

console.log('Env present. Bucket:', process.env.R2_BUCKET)
console.log('Public URL base:', process.env.R2_PUBLIC_URL)

// 1x1 transparent PNG
const pngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
const buffer = Buffer.from(pngBase64, 'base64')

;(async () => {
  try {
    const url1 = await uploadImage({ buffer, mimetype: 'image/png' })
    console.log('Upload 1 ->', url1)

    const url2 = await uploadImage({ buffer, mimetype: 'image/png' })
    console.log('Upload 2 ->', url2)

    if (url1 !== url2) {
      console.error('FAIL: dedup broken — got different URLs for identical content')
      process.exit(1)
    }
    console.log('Dedup OK: identical content returned same URL.')

    const res = await fetch(url1)
    console.log(`GET ${url1} -> ${res.status} ${res.statusText}`)
    const ct = res.headers.get('content-type')
    const cl = res.headers.get('content-length')
    console.log(`Content-Type: ${ct}, Content-Length: ${cl}`)
    if (!res.ok) {
      console.error('Public fetch failed — check that the bucket has public access enabled.')
      process.exit(2)
    }
    console.log('All good. R2 upload + dedup + public read working.')
  } catch (err) {
    console.error('FAIL:', err.message)
    if (err.$metadata) console.error('AWS metadata:', err.$metadata)
    process.exit(1)
  }
})()
