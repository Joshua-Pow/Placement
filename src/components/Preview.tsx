import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  filePath: string | null;
  clearFileInput: () => void;
  uploadFile: () => void;
};

const Preview = ({ filePath, clearFileInput, uploadFile }: Props) => {
  return (
    <>
      {filePath && (
        <Card>
          <CardHeader>
            <CardTitle>File Upload Preview</CardTitle>
            <CardDescription>
              Visual preview of the pdf uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <embed
              style={{ width: '600px', height: '800px' }}
              type="application/pdf"
              src={filePath}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant={'secondary'} onClick={clearFileInput}>
              Cancel
            </Button>
            <Button onClick={uploadFile}>Confirm</Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Preview;
