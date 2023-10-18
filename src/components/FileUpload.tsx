import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';

const FileUpload = () => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [pdf, setPdf] = useState<string | null>(null);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdf(URL.createObjectURL(file));
      } else {
        toast({
          variant: 'destructive',
          description: 'Incorrect file type, must be a pdf',
        });
        clearInput();
      }
    }
  };

  const uploadFile = () => {
    //Insert backend request here
  };

  const clearInput = () => {
    setPdf(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
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
      <Preview filePath={pdf} clearInput={clearInput} uploadFile={uploadFile} />
    </>
  );
};

export default FileUpload;
