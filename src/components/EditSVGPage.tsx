// pages/edit-svg.tsx

import React, { useEffect, useRef } from 'react';
import paper from 'paper';
import DOMPurify from 'dompurify';

type Props = {
  svgString: string;
};

const hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5,
};

const EditSVGPage = ({ svgString }: Props) => {
  const sanitizedSvg = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    paper.setup(canvasRef.current as HTMLCanvasElement);
    let segment: paper.Segment | null = null;
    let path: paper.Path | null = null;
    let movePath = false;
    paper.project.importSVG(sanitizedSvg, (svgItem) => {
      svgItem.fitBounds(paper.view.bounds);
      svgItem.position = paper.view.center;
      console.log('svgItem', svgItem);

      svgItem.children.forEach((child) => {
        if (child instanceof paper.Path) {
          console.log('child', child);
          // Apply smoothing to each path
          child.strokeColor = 'black';
          //child.selected = true;

          //Only simplify the path if it has more than 20 segments
          if (child.segments.length > 50) {
            //Make sure to keep straight lines straight
            child.simplify();
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
          const location = hitResult.location;
          segment = path.insert(location.index + 1, event.point);
          path.smooth();
        }
      }
      movePath = hitResult.type === 'fill';
      if (movePath) paper.project.activeLayer.addChild(hitResult.item);
    };

    paper.view.onMouseMove = (event: paper.ToolEvent) => {
      paper.project.activeLayer.selected = false;
      console.log('eventOver', event);
      if (event.item) {
        event.item.selected = true;
      }
    };

    paper.view.onMouseDrag = (event: paper.ToolEvent) => {
      if (segment) {
        segment.point = (segment.point as paper.Point).add(event.delta);
        path?.smooth();
      } else if (path) {
        path.position = (path.position as paper.Point).add(event.delta);
      }
    };
  }, [sanitizedSvg]);

  return (
    <canvas
      style={{ width: '100%', height: '500px' }}
      ref={canvasRef}
      id="myCanvas"
    ></canvas>
  );
};

export default EditSVGPage;
