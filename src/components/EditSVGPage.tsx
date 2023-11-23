import React, { useCallback, useEffect, useRef, useState } from 'react';
import paper from 'paper';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

type Props = {
  svgString: string;
  setPdfUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5,
};

const EditSVGPage = ({ svgString, setPdfUploading }: Props) => {
  const [finalSVG, setFinalSVG] = useState<string | SVGElement>('');
  const sanitizedSvg = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    paper.setup(canvasRef.current as HTMLCanvasElement);
    let segment: paper.Segment | null = null;
    let path: paper.Path | null = null;
    let movePath = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paper.project.importSVG(sanitizedSvg, (svgItem: any) => {
      svgItem.fitBounds(paper.view.bounds);
      svgItem.position = paper.view.center;

      console.log(svgItem.children);

      svgItem.children.forEach((child: paper.Path | paper.Shape) => {
        if (child instanceof paper.Path) {
          child.strokeColor = new paper.Color(255, 255, 255, 0.25);
          child.fillColor = new paper.Color(255, 255, 255, 0.25);

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

    paper.view.onMouseDrag = (event: paper.ToolEvent) => {
      if (segment) {
        segment.point = (segment.point as paper.Point).add(event.delta);
        // path?.smooth();
      } else if (path) {
        path.position = (path.position as paper.Point).add(event.delta);
      }
    };
  }, [sanitizedSvg]);

  const onSaveClicked = useCallback(() => {
    setFinalSVG(paper.project.exportSVG());
    setPdfUploading(true);

    //TODO: Upload the new svg to the backend
    console.log('finalSVG', finalSVG);
  }, [finalSVG, setPdfUploading]);

  return (
    <div>
      <canvas
        style={{
          width: '100%',
          height: '500px',
          backgroundRepeat: 'no-repeat', // Prevents the background image from repeating
          backgroundPosition: 'center', // Centers the background image
          backgroundSize: 'contain', // Adjust this as needed ('cover' or 'contain')
          backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
            svgString,
          )}')`,
        }}
        ref={canvasRef}
        id="myCanvas"
      ></canvas>
      <div className="float-right">
        <Button onClick={onSaveClicked}>Save</Button>
      </div>
    </div>
  );
};

export default EditSVGPage;
