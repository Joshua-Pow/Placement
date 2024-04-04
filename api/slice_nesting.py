# GRACE-TODO: fine tune rate of granuality increase with iteration number
# for now, one rectangle per iteration
import copy


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
    m = 4 # spacing buffer

    # stage one, update boundaries per polygon
    for polygon in polygons:
        top_y = polygon.y
        slices_count = iteration_number*2-1
        delta = polygon.height / slices_count

        for i in range(0, slices_count):
            # polygon.bbox_list.append([])  # each polygon has a list of tuple of tuples
            # polygon_boundary = [ (min x, min y), (max x, max y)] [ (min x2, min y2), (max x2, max y2) ] etc

            # filter points to a specific y band
            min_y = top_y + (i) * delta
            max_y = top_y + (i + 1) * delta
            points_in_range = []
            near_x_min = polygon.x
            near_x_max = polygon.x+polygon.width
            for point in polygon.getContour(): 

                if max_y >= point[1] and point[1] >= min_y:
                    points_in_range.append(point)
                elif point[1] > near_x_min and point[1] < max_y:
                    near_x_min = point[1]
                elif point[1] < near_x_max and point[1] > min_y:
                    near_x_max = point[1]

            # Check if points_in_range is not empty before proceeding
            if not points_in_range:
                points_in_range.append( [near_x_min, min_y])
                points_in_range.append( [near_x_max, max_y])


            # store min and max
            # TODO: optimize min-max search since lines are continuous, so the shape will always
            # be one of the following: < > / \ | (at least 99% of the time)
            min_x = min(points_in_range, key=lambda point: point[0])[0]
            max_x = max(points_in_range, key=lambda point: point[0])[0]
            polygon.bbox_list.append([])
            polygon.bbox_list[i].append([])
            polygon.bbox_list[i] =  [min_x, min_y], [max_x, max_y]
            #polygon.bbox_list.append([ [min_x, min_y], [max_x, max_y]])


    # pack in order of descending length
    polygons.sort(key=lambda polygon: polygon.height, reverse=True)

    # clone list and remove when shapes are placed
    p2 = polygons.copy()
    placed_list = [(0, 0)]
    p3 = []  # new polygons once placed
    passed = True

    while p2 != []:
        # greedy, move biggest as close as possible
        # store bottom left of previously placed shapes, attempt to place
        # new shape at those positions

        # take first element in p2, remove it
        new_poly = p2[0]
        p2.pop(0)


        #sort potential placements by lowest y + x first
        placed_list.sort(key=lambda tuple: tuple[1]+0.1*tuple[0], reverse=False)

        # move to elements on placed_list until boundary_check_pass
        # filter p3 by bbox in range of new shape and only check those
        for i in range(0, len(placed_list)):
            new_poly.move(placed_list[i][0], placed_list[i][1])
            passed = True

            if (new_poly.x + new_poly.width + m >= container_max_x):
                passed = False
            else:
                for p in p3:
                    if not boundary_check_pass(new_poly, p, container_max_x):
                        passed = False
                        break

            # remove that placement from placed_list
            if passed:
                placed_list.pop(i)
                break
        
        if not passed: # SHOULD NOT HAPPEN. means piece was wider than the fabric.
            print(f"big uh oh. no valid placements found for shape at {new_poly}")
            return
        

        # for each subslice
        for slice_box in new_poly.bbox_list:

            if (slice_box[1][0]+m < container_max_x):

                #bottom right
                placed_list.append((slice_box[1][0]+m, slice_box[1][1]+m))

                #top right
                placed_list.append((slice_box[1][0]+m, slice_box[0][1]+m)) 

                #max x, y = 0 / top
                placed_list.append((slice_box[1][0]+m, 0))
        
        # bottom left of entire shape
        placed_list.append((new_poly.x+m, new_poly.y+new_poly.height+m))

        # add shape to p3
        p3.append(copy.deepcopy(new_poly))
    assert len(polygons) == len(p3)
    polygons = copy.deepcopy(p3)  # set polygon placements to new ones

 
def boundary_check_pass(p1, p2, container_max_x):
    """
    This method checks the boundary rectangles of two polygons
    and returns true IF NO collision
    """
    m = 2  # margin 10 pixels 

    # if yes intersect, actually check all sub boxes
    if (p1.x + p1.width + m >= container_max_x or p2.x + p2.width + m >= container_max_x):
        return False
    if (
        p1.x + m <= p2.x + p2.width 
        and p1.x + p1.width >= p2.x + m
        and p1.y + p1.height  >= p2.y +m
        and p1.y + m <= p2.y + p2.height
    ):
        return bbox_lists_check_pass(p1.bbox_list, p2.bbox_list, container_max_x)
    return True


def bbox_lists_check_pass(list1, list2, container_max_x):
    """
    This method checks the boundaries of two polygons
    thru their bbox_lists and returns true IF NO collision
    Parameters:
        list1: list tuple(tuple) of ((minx,miny),(maxx,maxy)) for polygon1
        list2: list tuple(tuple) of ((minx,miny),(maxx,maxy)) for polygon2
    """
    #print(f"list1: {list1}")
    m = 2  # margin 10 pixels
    passed = True
    for box1 in list1:
        for box2 in list2:
            # separating axis theorem
            # top leftx = box[1][0] & top lefty = box[1][1]
            # bot rightx = box[0][0] & bot righty = box[0][1]

            #polygon.bbox_list.append(((min_x, min_y), (max_x, max_y)))
            if (
                box1[0][0] <= box2[1][0]
                and box1[1][0] >= box2[0][0]
                and box1[0][1] <= box2[1][1]
                and box1[1][1] >= box2[0][1]
            ):
                passed = False
            if (
                box1[1][0] +m > container_max_x 
                or box2[1][0] +m > container_max_x
            ):
                passed = False
    return passed
