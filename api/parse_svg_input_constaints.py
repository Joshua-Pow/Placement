from svg.path import parse_path
from svg.path.path import Line
from xml.dom import minidom
from api.polygon import Polygon


def parse_svg(svgString: str):
    """
    Parse a SVG string and return a list of Polygon objects based on the SVG paths.
    Note: we only deal with SVG Line for now.
    TODO: once we have curves or other shapes in SVG, we need to handle those in this function.
    """
    # read the SVG file
    doc = minidom.parseString(svgString)
    path_strings = [path.getAttribute("d") for path in doc.getElementsByTagName("path")]
    doc.unlink()

    polygons = []
    num_polygons = 0
    space_margin = 2
    # print the line draw commands
    for path_string in path_strings:
        # using parse_path here since in the future we might have curve lines
        # and this python library would be useful
        path = parse_path(path_string)
        contour = []
        is_empty = True

        for e in path:
            # only dealing with lines here (no curves)
            if isinstance(e, Line):
                if is_empty:
                    x0 = e.start.real
                    y0 = e.start.imag
                    contour.append([x0, y0])
                    left_x = x0
                    bottom_y = y0
                    right_x = x0
                    top_y = y0
                    is_empty = False

                x1 = e.end.real
                y1 = e.end.imag
                contour.append([x1, y1])
                if x1 < left_x:
                    left_x = x1
                elif x1 > right_x:
                    right_x = x1

                if y1 < bottom_y:
                    bottom_y = y1
                elif y1 > top_y:
                    top_y = y1

                # debug
                # print("(%.2f, %.2f) - (%.2f, %.2f)" % (x0, y0, x1, y1))

        p = Polygon(
            contour,
            left_x,
            bottom_y,
            right_x - left_x,
            top_y - bottom_y,
            bonding_box_margin=space_margin,
            pid=num_polygons,
        )
        polygons.append(p)
        num_polygons += 1

    return polygons


def parse_fabric_input_constraints(fabirc_height, fabric_max_length):
    # TODO
    pass


def translate_polygons_to_SVG(polygons, viewbox_width, viewbox_height, new_filename):
    with open(new_filename, "w+") as f:
        f.write(
            f'<svg viewBox="0 0 {viewbox_width} {viewbox_height}" xmlns="http://www.w3.org/2000/svg">'
        )

        for p in polygons:
            c = p.contour
            f.write('<path d="M')
            for i in range(len(c)):
                x, y = c[i]
                f.write(f"{x} {y} ")
            f.write('Z" fill="none" stroke="hsl(var(--primary))" stroke-width="3"/>')
        f.write("</svg>")


## Usage ##
# polygons = parse_svg('simple_shapes.svg')

# container_max_x = 10000
# container_max_y = 4000
# rectangle_packing(polygons, container_max_x, container_max_y)

# translate_polygons_to_SVG(polygons, 2000, 2000, "new_placement.svg")
