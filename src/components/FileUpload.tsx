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
type Iteration = { svg: string; yardage: string };
export type Iterations = { [key: number]: Iteration };

const FileUpload = () => {
  const { toast } = useToast();
  const [filePath, setFilePath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string>('');
  const [iterationId, setIterationId] = useState<string>('');
  const [iterationCount, setIterationCount] = useState<number>(1);
  const [iterationSVGs, setIterationSVGs] = useState<Iterations>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onReset = useCallback(() => {
    setSubmitted(false);
    setFilePath(null);
    setSvgString('');
    setIterationId('');
    setIterationCount(1);
    setIterationSVGs([]);
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

  const pollSVG = useCallback((id: string, iterationCount: number) => {
    axios
      .get(`/api/poll/`, {
        params: { id: id, iteration: iterationCount },
      })
      .then((response) => {
        console.log('Polling response:', response.headers['yardage']);
        const svg = response.data;
        const yardage = response.headers['yardage'];
        setIterationSVGs((prev) => ({
          ...prev,
          [iterationCount]: { svg: svg, yardage: yardage },
        }));
        setIterationCount(iterationCount + 1);
        setTimeout(() => pollSVG(id, iterationCount + 1), 3000);
      })
      .catch((error) => {
        console.log('Polling error:', error);
      });
  }, []);

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
          setIterationId(id);
          pollSVG(id, iterationCount);
        });
    },
    [iterationCount, pollSVG, toast],
  );

  const shapeUpload = useCallback(
    (svg: Shape[]) => {
      setLoading(true);
      setSubmitted(true);
      // const svg = paper.project.exportSVG({ asString: true }) as string;
      postSVG(svg);
      setLoading(false);
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
            <IterationVisualizer iterations={iterationSVGs} />
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
