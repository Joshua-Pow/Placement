import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollShadow } from '@nextui-org/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

type Iteration = { svg: string };
type Props = { iterations: Iteration[] };

const IterationVisualizer = ({ iterations }: Props) => {
  const [selectedIteration, setSelectedIteration] = React.useState(0);

  const handleIterationChange = (index: number) => {
    setSelectedIteration(index);
  };

  const downloadPng = async (svgString: string) => {
    //Look for the string var(--primary) and replace it with 6d28d9
    svgString = svgString.replaceAll('hsl(var(--primary))', '#6d28d9');
    // Convert SVG string to data URL
    console.log('svgString', svgString);
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    // Load the SVG into an image
    const img = new Image();
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 4; //TODO: remove the *4
      canvas.height = img.height * 4;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL('image/png');

      // Create a link to download the PNG
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'image.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };
  console.log('iterations', iterations);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Iteration Visualizer</CardTitle>
        <CardDescription>
          Click each itertation number to see the orientations.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="flex flex-col justify-between">
          <ScrollShadow
            hideScrollBar
            className="gap-4 flex flex-col max-h-[300px] overflow-y-auto"
          >
            {iterations.map((iterationValue, index) => (
              <Badge
                key={index}
                className={`cursor-pointer self-center`}
                variant={selectedIteration === index ? 'default' : 'secondary'}
                onClick={() => handleIterationChange(Number(index))}
              >
                <span className="font-bold">{`Iteration ${index}`}</span>
              </Badge>
            ))}
          </ScrollShadow>
          <div className="flex items-center gap-2">
            <span className="font-bold">Save: </span>
            <Button
              onClick={() => downloadPng(iterations[selectedIteration].svg)}
              variant="outline"
              size="icon"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="flex-grow">
          <CardHeader>
            <CardTitle className="text-center">{`Iteration ${selectedIteration}`}</CardTitle>
          </CardHeader>
          <CardContent className="w-[800px] h-[800px]">
            <div
              dangerouslySetInnerHTML={{
                __html: iterations[selectedIteration].svg,
              }}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default IterationVisualizer;
