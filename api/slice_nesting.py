# GRACE-TODO: fine tune rate of granuality increase with iteration number
# for now, one rectangle per iteration


# TODO: use container_max_x in boundary checks


def slice_nesting(polygons, container_max_x, iteration_number=1):
    """
    Packing algorithm which divides shapes along the y-axis into smaller
    rectangles for closer packing. The bounding box is therefore a collection
    of connected rectangles.

    Parameters:
        polygons: list of Polygon objects to nest
        container_max_x: container dimension constraints, tied to fabric width
        iteration_number: the current iteration to compute. A higher number
        will create more rectangles per polygon
    """

    # stage one, update boundaries per polygon
    for polygon in polygons:
        top_y = polygon.y
        delta = polygon.height / iteration_number
        polygon.bbox_list_area = 0

        for i in range(0, iteration_number):
            polygon.bbox_list.append([])  # each polygon has a list of tuple of tuples
            # polygon_boundary = [ (min x, min y), (max x, max y)] [ (min x2, min y2), (max x2, max y2) ] etc

            # filter points to a specific y band
            min_y = top_y + (i - 1) * delta
            max_y = top_y + i * delta
            points_in_range = []
            for point in polygon.getContour():
                if max_y > point[1] and point[1] > min_y:
                    points_in_range.append(point)

            print(f"!!! grace debug delta {delta} and min_y {min_y} and max_y {max_y} and p len {len(points_in_range)}")

            # store min and max
            # TODO: optimize min-max search since lines are continuous, so the shape will always
            # be one of the following: < > / \ | (at least 99% of the time)
            min_x = min(points_in_range, key=lambda point: point[0])
            max_x = max(points_in_range, key=lambda point: point[0])
            polygon.bbox_list.append(((min_x, min_y), (max_x, max_y)))
            polygon.bbox_list_area += (max_x - min_x) * (max_y - min_y)

    # pack in order of descending size
    polygons.sort(key=lambda polygon: polygon.bbox_list_area, reverse=True)

    # clone list and remove when shapes are placed
    p2 = polygons.copy()
    placed_list = [(0, 0)]
    p3 = []  # new polygons once placed

    while p2 != []:
        # greedy, move biggest as close as possible
        # store bottom left of previously placed shapes, attempt to place
        # new shape at those positions

        # take first element in p2, remove it
        new_poly = p2[0]
        p2.pop(0)

        # move to elements on placed_list until boundary_check_pass
        # filter p3 by bbox in range of new shape and only check those
        for i in range(0, len(placed_list)):
            new_poly.move(placed_list[i][0], placed_list[i][1])
            for p in p3:
                if boundary_check_pass(new_poly, p):
                    break

            # remove that placement from placed_list
            placed_list.pop(i)
            break

        # add shape bottom left (max y min x) to placed_list
        placed_list.append((new_poly.x, new_poly.y + new_poly.height))

        # add shape to p3
        p3.append(new_poly)

    assert len(polygons) == len(p3)
    polygons = p3  # set polygon placements to new ones


def boundary_check_pass(p1, p2):
    """
    This method checks the boundary rectangles of two polygons
    and returns true IF NO collision
    """
    m = 10  # margin 10 pixels

    # check entire polygon bounding boxes first, if these don't intersect then return true
    if p1.x - p2.x > m and p2.x + p2.width - p1.x > m:
        if p1.y - p2.y > m and p2.y + p2.height - p1.y > m:
            return bbox_lists_check_pass(p1.bbox_list, p2.bbox_list)
        else:
            return True

    elif p2.x - p1.x > m and p1.x + p1.width - p2.x > m:
        if p2.y - p1.y > m and p1.y + p1.height - p2.y > m:
            return bbox_lists_check_pass(p1.bbox_list, p2.bbox_list)
        else:
            return True

    return True


def bbox_lists_check_pass(list1, list2):
    """
    This method checks the boundaries of two polygons
    thru their bbox_lists and returns true IF NO collision
    Parameters:
        list1: list tuple(tuple) of ((minx,miny),(maxx,maxy)) for polygon1
        list2: list tuple(tuple) of ((minx,miny),(maxx,maxy)) for polygon2
    """

    for box1 in list1:
        for box2 in list2:
            # separating axis theorem
            # top leftx = box[1][0] & top lefty = box[1][1]
            # bot rightx = box[0][0] & bot righty = box[0][1]
            if not (
                box1[1][0] < box2[0][0]
                or box1[0][0] > box2[1][0]
                or box1[1][1] < box2[0][1]
                or box1[0][1] > box2[1][1]
            ):
                return False

    return True
