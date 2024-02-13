import React, { useCallback, useEffect, useRef, useState } from 'react';
import paper from 'paper';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from './ui/card';
import { Grab, Hand, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { Toggle } from './ui/toggle';

type Props = {
  svgString: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shapeUpload: (svg: string) => void;
};

const hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5,
};

const zoomFactor = 1.1;

const EditSVGPage = ({ svgString, shapeUpload }: Props) => {
  const sanitizedSvg = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_resetCount, setResetCount] = useState<number>(0);
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const zoomIn = useCallback(() => {
    paper.view.zoom *= zoomFactor;
  }, []);

  const zoomOut = useCallback(() => {
    paper.view.zoom /= zoomFactor;
  }, []);

  const onWheel = useCallback((event: React.WheelEvent<HTMLCanvasElement>) => {
    console.log('event', event);
    // Prevent scrolling on the page
    event.preventDefault();

    const ZOOM_FACTOR = 1.1;

    // Store previous view state.
    const oldZoom = paper.view.zoom;
    const oldCenter = paper.view.center;

    // Get mouse position.
    // It needs to be converted into project coordinates system.
    const mousePosition = paper.view.viewToProject(
      new paper.Point(event.nativeEvent.offsetX, event.nativeEvent.offsetY),
    );

    // Update view zoom.
    const newZoom =
      event.deltaY < 0 ? oldZoom * ZOOM_FACTOR : oldZoom / ZOOM_FACTOR;
    paper.view.zoom = newZoom;

    // Update view position.
    // Correct the arithmetic operation to work with Point objects
    const newCenter = oldCenter.add(
      mousePosition.subtract(oldCenter).multiply(1 - oldZoom / newZoom),
    );
    paper.view.center = newCenter;
    setBgPosition({ x: newCenter.x, y: newCenter.y }); // Update background position state
    event.defaultPrevented = true;
  }, []);

  useEffect(() => {
    paper.setup(canvasRef.current as HTMLCanvasElement);
    let segment: paper.Segment | null = null;
    let path: paper.Path | null = null;
    let movePath = false;

    //This adds the svg as a background image with a blue border
    const raster = new paper.Raster({
      source: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
      position: paper.view.center,
      onLoad: () => {
        raster.position = paper.view.center;
        raster.fitBounds(paper.view.bounds);
        // Create a blue border around the raster
        const border = new paper.Path.Rectangle(raster.bounds);
        border.strokeColor = new paper.Color('blue');
        border.strokeWidth = 2;
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paper.project.importSVG(sanitizedSvg, (svgItem: any) => {
      svgItem.fitBounds(paper.view.bounds);
      svgItem.position = paper.view.center;

      svgItem.children.forEach((child: paper.Path | paper.Shape) => {
        if (child instanceof paper.Path) {
          child.strokeWidth = 2;
          child.strokeColor = new paper.Color('#9a6be580');
          child.fillColor = new paper.Color('#c8adf180');

          child.onMouseEnter = (event: paper.MouseEvent) => {
            console.log('mouseEnter', event);
            event.target.selected = true;
          };
          child.onMouseLeave = (event: paper.MouseEvent) => {
            console.log('mouseLeave', event);
            event.target.selected = false;
          };

          // Go through all points
          // Remove the ones that are closer than 5pt to the previous point
          // Need to take into account the shapes total size

          for (let i = 0; i < child.segments.length; i++) {
            const currentSegment = child.segments[i];
            const previousSegment = child.segments[i - 1];
            if (previousSegment) {
              const distance = currentSegment.point.getDistance(
                previousSegment.point,
              );

              if (distance < 10) {
                currentSegment.remove();
                i--;
              }
            }
          }

          //To prevent simplifying rectangles
          if (child.segments.length > 10) {
            //child.reduce();
            //child.simplify(0.02);
            //child.flatten(0.5);
            //child.smooth();
          }
        }
      });
    });

    paper.view.onMouseDown = (event: paper.ToolEvent) => {
      console.log('mouseDown', event);
      segment = path = null;
      const hitResult = paper.project.hitTest(event.point, hitOptions);
      if (!hitResult) return;

      //Delete points when shift is pressed
      if (event.modifiers.shift) {
        if (hitResult.type === 'segment') {
          hitResult.segment.remove();
        }
        return;
      }

      if (hitResult) {
        path = hitResult.item as paper.Path;
        if (hitResult.type === 'segment') {
          segment = hitResult.segment;
        } else if (hitResult.type === 'stroke') {
          //Use this to add points to the path when clicking on the stroke
          // const location = hitResult.location;
          // segment = path.insert(location.index + 1, event.point);
          // path.smooth();
        }
      }
      movePath = hitResult.type === 'fill';
      if (movePath) paper.project.activeLayer.addChild(hitResult.item);
    };

    const handleMouseDrag = (event: paper.ToolEvent) => {
      if (event.modifiers.shift) {
        paper.view.center = paper.view.center.subtract(event.delta);
      } else if (segment) {
        segment.point = (segment.point as paper.Point).add(event.delta);
        // path?.smooth();
      } else if (path) {
        path.position = (path.position as paper.Point).add(event.delta);
      }
    };

    paper.view.onMouseDrag = handleMouseDrag;

    return () => {
      // Cleanup
      paper.project.clear();
    };
  }, [sanitizedSvg, _resetCount, svgString]);

  const onClearClicked = useCallback(() => {
    console.log(paper.project.layers);
    setResetCount((reset) => reset + 1);
  }, [setResetCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shape Editor</CardTitle>
        <CardDescription>
          Move, Resize and adjust the shapes so they overlap the outlines in the
          background
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="relative">
          <div className="absolute z-50 top-2 right-2 flex gap-2">
            <Toggle
              className="group active:bg-gray-300 dark:active:bg-gray-700"
              variant="outline"
              pressed={isPanning}
              onClick={() => setIsPanning(!isPanning)}
            >
              {isPanning ? <Grab /> : <Hand />}
            </Toggle>
            <Button
              className="group active:bg-gray-300 dark:active:bg-gray-700"
              variant="outline"
              onClick={zoomIn}
            >
              <ZoomInIcon className="h-4 w-4 transform transition-transform group-hover:scale-110" />
            </Button>
            <Button
              className="group active:bg-gray-300 dark:active:bg-gray-700"
              variant="outline"
              onClick={zoomOut}
            >
              <ZoomOutIcon className="h-4 w-4 transform transition-transform group-hover:scale-90" />
            </Button>
          </div>

          <canvas
            style={{
              width: '100%',
              height: '500px',
            }}
            ref={canvasRef}
            id="myCanvas"
            //onWheel={onWheel}
          ></canvas>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="secondary"
          style={{ marginRight: 5 }}
          onClick={onClearClicked}
        >
          Reset
        </Button>
        <Button
          onClick={() =>
            shapeUpload(paper.project.exportSVG({ asString: true }) as string)
          }
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EditSVGPage;
