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
  setError: Dispatch<SetStateAction<string>>
) => {
  console.error('Failed to perform requested operation', error);

  if (isAppError(error) && error.response?.data?.message) {
    setError(error.response.data.message);
  } else {
    setError('An error occurred while creating the resource.');
  }
};