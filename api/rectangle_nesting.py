from rectpack import newPacker


def rectangle_packing(polygons, container_max_x, container_max_y):
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
        packer.add_rect(p.bbox_w, p.bbox_h, p.pid)

    packer.add_bin(container_max_x, container_max_y, 1)

    packer.pack()

    # Full rectangle list
    all_rects = packer.rect_list()

    for rect in all_rects:
        # bin, x, y, width, height, rectangle ID
        b, x, y, w, h, rid = rect

        # debug
        print(b, x, y, w, h, rid)

        polygons[rid].move(x, y)
