import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';
import IterationVisualizer from './IterationVisualizer';
const EditSVGPage = dynamic(() => import('./EditSVGPage'), { ssr: false });

const FileUpload = () => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | Blob>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const clearInput = () => {
    setFilePath(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setSubmitted(false);
      setSvgString('');
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
      setLoading(false);
    },
    [setFilePath, setPdf, toast],
  );

  const uploadFile = useCallback(() => {
    setLoading(true);
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
        toast({
          variant: 'default',
          description: 'File uploaded successfully!',
        });
        setLoading(false);
      });
  }, [pdf, toast]);

  const postSVG = useCallback(
    (svg: string) => {
      //PUT to the /api/pdf/ route
      axios
        .put('/api/pdf/', {
          svg: svg,
        })
        .then((response) => {
          toast({
            variant: 'default',
            description: 'File submitted successfully!',
          });
          const id = response.data.id;
          axios.get(`/api/poll/`, { params: { id: id } }).then((response) => {
            const svg = response.data;
            console.log('svg', svg);
            setSvgString(svg);
          });
        });
    },
    [toast],
  );

  const shapeUpload = useCallback(
    (svg: string) => {
      setLoading(true);
      setSubmitted(false);
      // const svg = paper.project.exportSVG({ asString: true }) as string;
      postSVG(svg);
      setSubmitted(true);
      setLoading(false);
    },
    [postSVG],
  );

  return (
    <>
      <div className="grid w-full max-w-2xl items-center gap-1.5 pb-1.5">
        <Label htmlFor="picture">PDF:</Label>
        <Input
          disabled={loading}
          ref={inputRef}
          id="picture"
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
        />
      </div>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : svgString ? (
        submitted ? (
          <IterationVisualizer
            iterations={[
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
              { svg: svgString },
            ]}
          />
        ) : (
          <EditSVGPage
            svgString={svgString}
            setLoading={setLoading}
            shapeUpload={shapeUpload}
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
