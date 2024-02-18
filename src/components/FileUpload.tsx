import React, { useCallback, useState } from 'react';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';
import IterationVisualizer from './IterationVisualizer';
import { Shape } from './EditSVGPage';
import { UploadForm, uploadSchema } from './UploadForm';
import { z } from 'zod';
import LoadingSkeleton from './LoadingSkeleton';
const EditSVGPage = dynamic(() => import('./EditSVGPage'), { ssr: false });

export type FabricUnit = z.infer<typeof uploadSchema>['unit'];
type PdfFile = z.infer<typeof uploadSchema>['file'];
type FabricWidth = z.infer<typeof uploadSchema>['width'];

const FileUpload = () => {
  const { toast } = useToast();
  const [filePath, setFilePath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onReset = useCallback(() => {
    setSubmitted(false);
    setFilePath(null);
    setSvgString('');
  }, []);

  const onFileUpload = useCallback(
    (pdfFile: PdfFile) => {
      setLoading(true);
      setFilePath(URL.createObjectURL(pdfFile));
      setLoading(false);
    },
    [setFilePath],
  );

  const onSubmitFile = useCallback(
    (pdfFile: PdfFile, fabricWidth: FabricWidth, fabricUnit: FabricUnit) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('width', fabricWidth.toString());
      formData.append('unit', fabricUnit);
      axios
        .post('/api/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
    },
    [toast],
  );

  const postSVG = useCallback(
    (svg: Shape[]) => {
      //PUT to the /api/pdf/ route
      console.log('svg', svg);
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
            setLoading(false);
          });
        });
    },
    [toast],
  );

  const shapeUpload = useCallback(
    (svg: Shape[]) => {
      setLoading(true);
      setSubmitted(true);
      // const svg = paper.project.exportSVG({ asString: true }) as string;
      postSVG(svg);
    },
    [postSVG],
  );

  return (
    <>
      <UploadForm
        onSubmitFile={onSubmitFile}
        onFileUpload={onFileUpload}
        onReset={onReset}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : svgString ? (
          submitted ? (
            <IterationVisualizer
              iterations={Array(40).fill({ svg: svgString })}
            />
          ) : (
            <EditSVGPage
              svgString={svgString}
              setLoading={setLoading}
              shapeUpload={shapeUpload}
            />
          )
        ) : (
          <Preview filePath={filePath} />
        )}
      </UploadForm>
    </>
  );
};

export default FileUpload;
