# GRACE-TODO: fine tune rate of granuality increase with iteration number
# for now, one rectangle per iteration

def slice_nesting(polygons, container_max_x, container_max_y, iteration_number=1):
     """
    Packing algorithm which divides shapes along the y-axis into smaller
    rectangles for closer packing. The bounding box is therefore a collection
    of connected rectangles.

    Parameters:
        polygons: list of Polygon objects to nest
        container_max_x, container_max_y: container dimension constraints
        iteration_number: the current iteration to compute. A higher number
        will create more rectangles per polygon
    """

    # stage one, update boundaries per polygon
    for polygon in polygons:

        top_y = polygon.y
        delta = polygon.height / iteration_number
        polygon.bbox_list_area = 0

        for (i in range iteration_number):

            polygon.bbox_list.append([]) # each polygon has a list of tuple of tuples
            # polygon_boundary = [ (min x, min y), (max x, max y)] [ (min x2, min y2), (max x2, max y2) ] etc

            # filter points to a specific y band
            min_y = top_y + (i-1)*delta
            max_y = top_y + i*delta
            points_in_range = filter(lambda obj: max_y > obj[1] > min_y , polygon.contour())
            
            # store min and max
            # TODO: optimize min-max search since lines are continuous, so the shape will always
            # be one of the following: < > / \ | (at least 99% of the time)
            min_x = min(points_in_range, key=lambda point: point[0])
            max_x = max(points_in_range, key=lambda point: point[0])
            polygon.bbox_list.append(tuple( tuple(min_x, min_y) , tuple(max_x, max_y) ) )
            polygon.bbox_list_area += (max_x - min_x)*(max_y - min_y)

    # pack in order of descending size
    polygons.sort(key=lambda polygon: polygon.bbox_list_area, reverse=true)

    # clone list and remove when shapes are placed
    p2 = polygons.copy()


