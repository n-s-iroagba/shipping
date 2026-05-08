/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dispatch, SetStateAction } from 'react';
export const formatDate = (daysToAdd: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const day = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const dateNum = date.getDate();

  const suffix =
    dateNum === 1 || dateNum === 21 || dateNum === 31
      ? "ST"
      : dateNum === 2 || dateNum === 22
        ? "ND"
        : dateNum === 3 || dateNum === 23
          ? "RD"
          : "TH";

  return `${day} ${dateNum}${suffix} ${month} ${date.getFullYear()}`;
};



// Define a minimal shape for Axios-like errors
interface AppError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Type guard to check if error is AppError
function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object'
  );
}

export const handleError = (
  error: unknown,
  setError: Dispatch<SetStateAction<string | null>>
) => {
  console.error('Failed to perform requested operation', error);

  if (isAppError(error) && error.response?.data?.message) {
    setError(error.response.data.message);
  } else {
    setError('An error occurred while creating the resource.');
  }
};

export const uploadFile = async (
  file: File,
  type: 'thumbnail' | 'video' | 'image'
) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'amafor');

    // Use 'auto' resource type to let Cloudinary detect the format (image, video, or raw)
    const cloudUrl = `https://api.cloudinary.com/v1_1/dh2cpesxu/auto/upload`;

    const uploadRes = await fetch(cloudUrl, { method: 'POST', body: formData });
    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error('[Cloudinary Upload Error Details]', {
        status: uploadRes.status,
        statusText: uploadRes.statusText,
        data
      });
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

    console.log('[Cloudinary Smart Upload Success]', {
      url: data.url,
      resource_type: data.resource_type,
      format: data.format
    });

    // Return the standard Public URL (HTTP) for compatibility
    return data.url;
  } catch (error) {
    console.error('[uploadFile Utility Error]', error);
    throw error;
  }
};