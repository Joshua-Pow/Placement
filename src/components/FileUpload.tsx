import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';
const EditSVGPage = dynamic(() => import('./EditSVGPage'), { ssr: false });

const FileUpload = () => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | Blob>('');
  const [pdfUploading, setPdfUploading] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string>('');

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

  const uploadFile = useCallback(() => {
    setPdfUploading(true);
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
        setSvgString(res.data);
        setPdfUploading(false);
      });
  }, [pdf]);

  return (
    <>
      <div className="grid w-full max-w-2xl items-center gap-1.5">
        <Label htmlFor="picture">PDF:</Label>
        <Input
          disabled={pdfUploading}
          ref={inputRef}
          id="picture"
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
        />
      </div>
      {svgString ? (
        pdfUploading ? (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <EditSVGPage
            svgString={svgString}
            setPdfUploading={setPdfUploading}
          />
        )
      ) : (
        <Preview
          filePath={filePath}
          clearInput={clearInput}
          uploadFile={uploadFile}
        />
      )}
    </>
  );
};

export default FileUpload;
