import json


class Polygon(object):
    """
    Polygon class contains all the specific attributes
    relating to a specific polygon shape
    """

    def __init__(
        self,
        contour: list[list[int]],
        x: int,
        y: int,
        width: int,
        height: int,
        bonding_box_margin: int = 0,
        pid: int | None = None,
    ):
        """
        contour: list of coordinates describing the polygon
        x, y: min_x, min_y
        width: width of the polygon (ie. max_x - min_x)
        height: height of the polygon (ie. max_y - min_y)
        margin: space margin around bounding box
        pid: polygon ID
        """
        assert height > 0 and width > 0 and x >= 0 and y >= 0

        # TODO: add more fields/methods as needed (ie. constaints on rotation etc.)

        self.contour = contour
        self.width = width
        self.height = height
        self.x = x
        self.y = y
        self.pid = pid

        # margin for the bonding box around the polygon shape
        self.bonding_box_margin = bonding_box_margin

        # bounding box bottom left coordinate
        self.bbox_low_x = x - bonding_box_margin
        self.bbox_low_y = y - bonding_box_margin

        # bounding box width and height
        self.bbox_w = width + 2 * bonding_box_margin
        self.bbox_h = height + 2 * bonding_box_margin

    def __repr__(self):
        return "pid: {} Rect bounding box(x:{}, y:{}, width:{}, height:{})".format(
            self.pid, self.bbox_low_x, self.bbox_low_y, self.bbox_w, self.bbox_h
        )

    def move(self, new_bbox_low_x, new_bbox_low_y):
        """
        Move the polygon by updating the coordinates of the shape
        after obtaining a new placement.
        """
        x_move = new_bbox_low_x - self.bbox_low_x
        y_move = new_bbox_low_y - self.bbox_low_y
        for coord in self.contour:
            coord[0] += x_move
            coord[1] += y_move
        self.bbox_low_x = new_bbox_low_x
        self.bbox_low_y = new_bbox_low_y
        self.x += x_move
        self.y += y_move

    def bounding_box_area(self):
        """
        Area of the rectangle bounding box.
        returns list of points in a polygon
        """
        return (self.bbox_h) * (self.bbox_w)

    def getContour(self) -> list[list[int]]:
        return self.contour

    def toJSON(self) -> str:
        return json.dumps(self, default=lambda o: o.__dict__)

    def mirror_around_centre_y_axis(self):
        """
        Mirror a polygon shape around the centre horizontal y-axis.
        """
        centre_y = round(
            self.bbox_low_y + self.bbox_h / 2
        )  # TODO: Should this be an int or float?

        for coord in self.contour:
            if coord[1] > centre_y:
                coord[1] = centre_y - (coord[1] - centre_y)
            else:
                coord[1] = centre_y + (centre_y - coord[1])
