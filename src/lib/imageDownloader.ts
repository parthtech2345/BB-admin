import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function getDualUploadDirs(): { adminDir: string; websiteDir: string } {
  const adminDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(/*turbopackIgnore: true*/ adminDir)) {
    try {
      fs.mkdirSync(/*turbopackIgnore: true*/ adminDir, { recursive: true });
    } catch {
      // directory exists or cannot create
    }
  }

  // Dual-write target: BB-website/public/uploads
  const websiteDir =
    process.env.WEBSITE_UPLOADS_DIR ||
    path.resolve(/*turbopackIgnore: true*/ process.cwd(), '..', 'BB-website', 'public', 'uploads');

  if (!fs.existsSync(/*turbopackIgnore: true*/ websiteDir)) {
    try {
      fs.mkdirSync(/*turbopackIgnore: true*/ websiteDir, { recursive: true });
    } catch (e) {
      console.warn('Could not create BB-website uploads directory:', e);
    }
  }

  return { adminDir, websiteDir };
}

export function saveBufferToDualUploads(buffer: Buffer, filename: string): void {
  const { adminDir, websiteDir } = getDualUploadDirs();

  // 1. Write to admin uploads
  const adminPath = path.join(/*turbopackIgnore: true*/ adminDir, filename);
  fs.writeFileSync(/*turbopackIgnore: true*/ adminPath, buffer);

  // 2. Dual-write to public website uploads
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ websiteDir)) {
      const websitePath = path.join(/*turbopackIgnore: true*/ websiteDir, filename);
      fs.writeFileSync(/*turbopackIgnore: true*/ websitePath, buffer);
    }
  } catch (err) {
    console.error('Error dual-writing image to BB-website uploads:', err);
  }
}

export async function downloadImageToUploads(imageUrl: string): Promise<string> {
  const { adminDir, websiteDir } = getDualUploadDirs();

  // If already a local upload, ensure it exists in website uploads too
  if (imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(imageUrl);
    const adminPath = path.join(/*turbopackIgnore: true*/ adminDir, filename);
    const websitePath = path.join(/*turbopackIgnore: true*/ websiteDir, filename);

    if (fs.existsSync(/*turbopackIgnore: true*/ adminPath) && !fs.existsSync(/*turbopackIgnore: true*/ websitePath)) {
      try {
        fs.copyFileSync(/*turbopackIgnore: true*/ adminPath, websitePath);
      } catch (err) {
        console.warn('Could not sync existing upload to website uploads:', err);
      }
    }
    return imageUrl;
  }

  // If it's a relative path from the main website (e.g., /images/news/markets_xyz.jpg)
  if (imageUrl.startsWith('/images/')) {
    const sourceFilePath = path.join(/*turbopackIgnore: true*/ process.cwd(), '..', 'BB-website', 'public', imageUrl);
    if (fs.existsSync(/*turbopackIgnore: true*/ sourceFilePath)) {
      const ext = path.extname(imageUrl) || '.jpg';
      const filename = `bb_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
      const buffer = fs.readFileSync(/*turbopackIgnore: true*/ sourceFilePath);
      saveBufferToDualUploads(buffer, filename);
      return `/uploads/${filename}`;
    }
  }

  // If it's an HTTP/HTTPS remote URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let ext = '.jpg';
      if (contentType.includes('png')) ext = '.png';
      else if (contentType.includes('webp')) ext = '.webp';
      else if (contentType.includes('gif')) ext = '.gif';
      else if (contentType.includes('svg')) ext = '.svg';
      else {
        const urlExt = path.extname(new URL(imageUrl).pathname);
        if (urlExt && urlExt.length <= 5) ext = urlExt;
      }

      const filename = `downloaded_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      saveBufferToDualUploads(buffer, filename);

      return `/uploads/${filename}`;
    } catch (err) {
      console.error('Error downloading image from URL:', err);
      // Fallback: if download fails, return the original or throw
      throw new Error(`Could not download image from ${imageUrl}: ${(err as Error).message}`);
    }
  }

  return imageUrl;
}

export function saveBufferToUploads(buffer: Buffer, originalFilename: string): string {
  const ext = path.extname(originalFilename) || '.jpg';
  const filename = `upload_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
  saveBufferToDualUploads(buffer, filename);
  return `/uploads/${filename}`;
}
