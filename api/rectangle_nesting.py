from rectpack import newPacker

from api.polygon import Polygon


def rectangle_packing(
    polygons: list[Polygon], container_max_x: int, container_max_y: int
):
    """
    Main function that executes the rectangle packing using rectpack library for now
    TODO: this library trys to pack into the smallerst number of containers, but our goal is to
    minimize used container area.

    Parameters:
        polygons: list of Polygon objects to nest
        container_max_x, container_max_y: container dimension constraints

    """
    packer = newPacker(rotation=False)  # no rotation for now
    for p in polygons:
        packer.add_rect(width=p.bbox_w, height=p.bbox_h, rid=p.pid)

    packer.add_bin(width=container_max_x, height=container_max_y, count=1)

    packer.pack()

    # Full rectangle list
    all_rects = packer.rect_list()

    for rect in all_rects:
        # bin, x, y, width, height, rectangle ID
        b, x, y, w, h, rid = rect

        # debug
        #print(b, x, y, w, h, rid)

        polygon_to_move = next((p for p in polygons if p.pid == rid), None)
        if polygon_to_move:
            polygon_to_move.move(x, y)
