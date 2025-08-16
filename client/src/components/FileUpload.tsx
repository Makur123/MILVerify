import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  maxSize?: number;
  type: 'image' | 'audio';
  className?: string;
}

export function FileUpload({ accept, onFileSelect, maxSize = 25 * 1024 * 1024, type, className = "" }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <div className={`border border-gray-300 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {type === 'image' ? (
              <FileImage className="h-8 w-8 text-blue-500" />
            ) : (
              <Music className="h-8 w-8 text-green-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragActive 
          ? 'border-primary bg-blue-50' 
          : 'border-gray-300 hover:border-primary'
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${type}`)?.click()}
    >
      <input
        id={`file-input-${type}`}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      
      {type === 'image' ? (
        <>
          <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Image</h4>
          <p className="text-sm text-gray-500 mb-4">Detect AI-generated images and deepfakes</p>
          <p className="text-xs text-gray-400">JPG, PNG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB</p>
        </>
      ) : (
        <>
          <Music className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <h4 className="font-medium text-gray-900 mb-1">Upload Audio</h4>
          <p className="text-sm text-gray-500 mb-2">Analyze voice cloning and AI speech</p>
          <p className="text-xs text-gray-400">MP3, WAV, M4A up to {Math.round(maxSize / 1024 / 1024)}MB</p>
        </>
      )}
      
      <Button className="mt-4" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Choose File
      </Button>
    </div>
  );
}
