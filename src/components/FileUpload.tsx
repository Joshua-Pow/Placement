import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const FileUpload = () => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | Blob>('');

  const clearInput = () => {
    setFilePath(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.type === 'application/pdf') {
          setFilePath(URL.createObjectURL(file));
          setPdf(file);
        } else {
          toast({
            variant: 'destructive',
            description: 'Incorrect file type, must be a pdf',
          });
          clearInput();
        }
      } else {
        clearInput();
      }
    },
    [setFilePath, setPdf, toast],
  );

  const uploadFile = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', pdf);
    axios
      .post('/api/pdf', formData, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
      .then((res) => {
        // Receive the filename sent to backend, error checking later
        console.log(res);
      });
  }, [pdf]);

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">PDF:</Label>
        <Input
          ref={inputRef}
          id="picture"
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
        />
      </div>
      <Preview
        filePath={String(filePath)}
        clearInput={clearInput}
        uploadFile={uploadFile}
      />
    </>
  );
};

export default FileUpload;
