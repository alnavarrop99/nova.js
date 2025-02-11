import { useState } from "react";

export const useDownload = () => {
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleResponse = async (response) => {
    if (!response.ok) {
      throw new Error("Could not download file");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));

    return url;
  };

  const handleDownload = (fileName, url) => {
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadFile = async (fileName, fileUrl) => {
    setIsDownloading(true);

    try {
      const response = await fetch(fileUrl);
      const url = await handleResponse(response);

      handleDownload(fileName, url);
    } catch (error) {
      setError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    error,
    isDownloading,
    downloadFile,
  };
};
