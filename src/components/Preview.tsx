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
};

const Preview = ({ filePath }: Props) => {
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
        </Card>
      )}
    </>
  );
};

export default Preview;
