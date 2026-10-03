import type { Area, Point } from 'react-easy-crop';

import { useState, useRef, type ChangeEvent, type ReactElement } from 'react';

import { Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import CropperDialog from './cropper-dialog';
import HiddenInput from './hidden-input';
import ImagePreview from './image-preview';
import { createImage, base64ToFile } from './utils';
import FileCriteria from './file-criteria';

interface UploadedFile {
  fileName: string;
  fileType: string;
  imageSource: string | null;
}

interface ImageUploadCropperProps {
  name: string;
  label?: string;
  value?: File | null;
}

const ImageUploadCropper = ({
  name,
}: ImageUploadCropperProps): ReactElement => {
  const [isCropperDialogOpen, setOpenCropperDialog] = useState(false);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile>({
    fileName: '',
    fileType: '',
    imageSource: null,
  });
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // Pixel data of the cropped area

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleHiddenInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        fileName: file.name,
        fileType: file.type,
        imageSource: URL.createObjectURL(file),
      });
      setOpenCropperDialog(true);
    }
  };

  const handleCropComplete = (areaPixels: Area): void => {
    setCroppedAreaPixels(areaPixels);
  };

  const reset = (): void => {
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setUploadedFile({
      fileName: '',
      fileType: '',
      imageSource: null,
    });
    setOpenCropperDialog(false);
  };

  const handleCrop = async (): Promise<File | null> => {
    if (croppedAreaPixels && uploadedFile.imageSource) {
      const createdImage = await createImage(uploadedFile.imageSource);
      const file = await base64ToFile(
        createdImage,
        croppedAreaPixels,
        uploadedFile.fileName,
        uploadedFile.fileType
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      reset();
      setCroppedImage(file);

      return file;
    }

    return null;
  };

  const handleClose = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setUploadedFile({
      fileName: '',
      fileType: '',
      imageSource: null,
    });
    setOpenCropperDialog(false);
  };

  return (
    <>
      <Stack spacing={1.5}>
        <ImagePreview uploadedFile={croppedImage} />
        <Button
          variant="text"
          color="primary"
          size="small"
          startIcon={croppedImage ? <EditIcon /> : <FileUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          {croppedImage ? 'Change...' : 'Browse...'}
          <HiddenInput
            ref={fileInputRef}
            type="file"
            name={name}
            onChange={handleHiddenInputChange}
          />
        </Button>
        <FileCriteria file={croppedImage} />
      </Stack>

      <CropperDialog
        open={isCropperDialogOpen}
        crop={crop}
        zoom={zoom}
        imageSource={uploadedFile.imageSource}
        setCrop={setCrop}
        setZoom={setZoom}
        onClose={handleClose}
        onCrop={handleCrop}
        onCropcomplete={handleCropComplete}
      />
    </>
  );
};

export default ImageUploadCropper;
