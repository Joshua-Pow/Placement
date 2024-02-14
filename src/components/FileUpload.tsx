import React, { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Preview from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';
import IterationVisualizer from './IterationVisualizer';
import { Shape } from './EditSVGPage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
const EditSVGPage = dynamic(() => import('./EditSVGPage'), { ssr: false });

type FabricUnit = 'in' | 'cm';

const FileUpload = () => {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | Blob>('');
  const [fabricLength, setFabricLength] = useState<number | undefined>(
    undefined,
  );
  const [fabricUnit, setFabricUnit] = useState<FabricUnit>('in');
  const [loading, setLoading] = useState<boolean>(false);
  const [svgString, setSvgString] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const clearFileInput = () => {
    setFilePath(null);
    setFabricLength(undefined);
    setFabricUnit('in');
    setPdf('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      setSubmitted(false);
      setSvgString('');
      setSubmitted(false);
      setFabricLength(undefined);
      setFabricUnit('in');
      setPdf('');
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
          clearFileInput();
        }
      } else {
        clearFileInput();
      }
      setLoading(false);
    },
    [setFilePath, setPdf, toast],
  );

  const uploadFile = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', pdf);
    formData.append('length', fabricLength.toString());
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
  }, [fabricLength, fabricUnit, pdf, toast]);

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
          });
        });
    },
    [toast],
  );

  const shapeUpload = useCallback(
    (svg: Shape[]) => {
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
        <Label htmlFor="pdf">PDF:</Label>
        <Input
          disabled={loading}
          ref={inputRef}
          id="pdf"
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
        />

        {pdf && (
          <>
            <Label htmlFor="size">Fabric length:</Label>
            <div className="flex gap-2">
              {/* TODO: figure out a better number input */}
              <Input
                id="size"
                disabled={loading || pdf === ''}
                type="number"
                value={fabricLength}
                onChange={(e) => {
                  e.target.value
                    ? setFabricLength(Number(e.target.value))
                    : setFabricLength(undefined);
                }}
              />
              <Select
                disabled={loading || pdf === ''}
                value={fabricUnit}
                onValueChange={(value: FabricUnit) => setFabricUnit(value)}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue
                    className="text-muted-foreground"
                    placeholder="Unit"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">inches (in)</SelectItem>
                  <SelectItem value="cm">centimeters (cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
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
          clearFileInput={clearFileInput}
          uploadFile={uploadFile}
        />
      )}
    </>
  );
};

export default FileUpload;
