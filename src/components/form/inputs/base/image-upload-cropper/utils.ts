import type { Area } from 'react-easy-crop';

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });

export const base64ToFile = async (
  image: HTMLImageElement,
  pixelCrop: Area,
  filename = 'cropped-image.jpg',
  mimeType = 'image/jpeg'
): Promise<File> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas not supported');

  // Set the canvas size to the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the image onto the canvas based on the cropped area
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert the canvas to base64 string with the specified mimeType
  const dataUrl = canvas.toDataURL(mimeType, 1.0); // You can adjust the quality (0.8 here for JPEG)

  // Convert the base64 string to a Blob
  const byteString = window.atob(dataUrl.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Copy the byteString to the Uint8Array
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob from the byte array
  const blob = new Blob([uint8Array], { type: mimeType });

  // Return a File object from the Blob
  return new File([blob], filename, { type: mimeType });
};
