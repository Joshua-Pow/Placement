import React, { useCallback, useEffect, useRef, useState } from 'react';
import paper from 'paper';
import { Button } from '@/components/ui/button';
import { ShapePopover } from './ShapePopover';
import DOMPurify from 'dompurify';
import { Popover, PopoverTrigger } from './ui/popover';

type Props = {
  svgString: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  shapeUpload: (svg: string) => void;
};

export type Paths = {
  svgString: string | SVGElement;
  quantity: number;
  canRotate: boolean;
  placeOnFold: boolean;
};

const hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5,
};

const EditSVGPage = ({ svgString, shapeUpload }: Props) => {
  const sanitizedSvg = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_resetCount, setResetCount] = useState<number>(0);
  const [curId, setCurId] = useState<string>('');
  const [shapeMap, setShapeMap] = useState<Map<string, Paths>>(new Map());

  //setShapeMap((prev) => new Map(prev.set(curId, dummy)));

  // const onSaveClicked = () => {
  //   const finalSVG = paper.project.exportSVG({ asString: true });
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   paper.project.importSVG(finalSVG as string, (svgItem: any) => {
  //     svgItem.children.forEach((child: paper.Path | paper.Shape) => {
  //       console.log('child', child);
  //       const curPathString = child.exportSVG({ asString: true }) as string;
  //       const index = curPathString.indexOf('id="');
  //       const id = curPathString.substring(index + 4, index + 5);

  //       const curPath = {
  //         ...(shapeMap.get(id) as Paths),
  //         svgString: child.exportSVG({ asString: true }),
  //       };

  //       //console.log('curPath', curPath);

  //       setShapeMap(shapeMap.set(id, curPath));
  //     });
  //   });
  //   shapeUpload(paper.project.exportSVG({ asString: true }) as string);
  // };

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
          child.strokeWidth = 2;
          child.strokeColor = new paper.Color('#9a6be580');
          child.fillColor = new paper.Color('#c8adf180');

          const curPathString = child.exportSVG({ asString: true }) as string;
          const index = curPathString.indexOf('id="');
          const id = curPathString.substring(index + 4, index + 5);
          console.log('id', id);

          const curPath = {
            svgString: child.exportSVG({ asString: true }),
            quantity: 1,
            canRotate: false,
            placeOnFold: false,
          };

          setShapeMap(shapeMap.set(id, curPath));

          child.onMouseEnter = (event: paper.MouseEvent) => {
            //console.log('mouseEnter', event);
            event.target.selected = true;
          };
          child.onMouseLeave = (event: paper.MouseEvent) => {
            //console.log('mouseLeave', event);
            event.target.selected = false;
          };
          child.onMouseUp = () => {
            setCurId(id);
            console.log('mouseDown', id);
            console.log('shapeMap', shapeMap);
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
      //console.log('mouseDown', event);
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

    return () => {
      // Cleanup
      paper.project.clear();
    };
  }, [sanitizedSvg]);

  const onClearClicked = useCallback(() => {
    setResetCount((reset) => reset + 1);
  }, [setResetCount]);

  return (
    <Popover>
      <div>
        <PopoverTrigger asChild>
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
        </PopoverTrigger>
        <div className="flex justify-between">
          <Button
            variant="secondary"
            style={{ marginRight: 5 }}
            onClick={onClearClicked}
          >
            Reset
          </Button>
          <ShapePopover
            shapeDetails={shapeMap.get(curId) as Paths}
            setShapeMap={setShapeMap}
            id={curId}
          />
          <Button
            onClick={() => {
              const finalSVG = paper.project.exportSVG({ asString: true });
              shapeUpload(finalSVG as string);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default EditSVGPage;
