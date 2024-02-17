import json
import cv2 as cv
import numpy as np
from typing import Literal


def test_same_line(prev_coord, curr_coord, is_horizontal, line_axis):
    """
    Helper function to test if curr_coord is part of a fold line axis.
    Args:
        prev_coord: previous xy coordinate, list of two items
        curr_coord: current xy coordinate trying to test, list of two items
        is_horizontal: bool, True if it's a horizontal fold line
        line_axis: x or y value of the line axis
    Returns:
        bool, True if curr_coord is part of the fold line
    """

    # need to make sure x or y value is within a small range of the line axis
    tolerance = 5

    if is_horizontal:
        if curr_coord[1] == line_axis:
            return True
        if ((line_axis - tolerance) < prev_coord[1] < (line_axis + tolerance)) and (
            (line_axis - tolerance) < curr_coord[1] < (line_axis + tolerance)
        ):
            dy = abs(prev_coord[1] - curr_coord[1])
            dx = abs(prev_coord[0] - curr_coord[0])

            # if dy/dx is tiny, assume it's on the same line
            if (dx != 0) and ((dy / dx) < 0.1):
                return True

    else:
        if curr_coord[0] == line_axis:
            return True
        if ((line_axis - tolerance) < prev_coord[0] < (line_axis + tolerance)) and (
            (line_axis - tolerance) < curr_coord[0] < (line_axis + tolerance)
        ):
            dy = abs(prev_coord[1] - curr_coord[1])
            dx = abs(prev_coord[0] - curr_coord[0])

            # if dx/dy is tiny, assume it's on the same line
            if (dy != 0) and ((dx / dy) < 0.1):
                return True

    return False


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
        # TODO: fix this assert, it breaks when duplicating and folding
        # assert height > 0 and width > 0 and x >= 0 and y >= 0

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

        # for use in slice nesting
        self.bbox_list = []
        self.bbox_list_area = 0

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

    def centre_fold_manip(self, fold_line: Literal["top", "bottom", "left", "right"]):
        """
        Manipulate the centre fold piece by flip the polygon shape, and adjust the bounding box accordingly.
        fold_line: "top" (higher y-coord), "bottom" (lower y-coord), "left" (low x-coord), or "right" (high x-coord)
        """

        if (
            fold_line != "top"
            and fold_line != "bottom"
            and fold_line != "left"
            and fold_line != "right"
        ):
            print("Wrong input for fold_line!")
            return

        # find the fold line axis
        if fold_line == "bottom":
            fold_line_axis = self.y + self.height
        elif fold_line == "top":
            fold_line_axis = self.y
        elif fold_line == "left":
            fold_line_axis = self.x
        elif fold_line == "right":
            fold_line_axis = self.x + self.width

        is_hori = fold_line == "top" or fold_line == "bottom"

        # print(
        #    "Trying to manipulate shape with fold_line on the {}, fold_line_axis={}:".format(
        #        fold_line, fold_line_axis
        #    )
        # )

        # find the indices of the points that are on the fold line
        fold_line_indices = []
        started = False
        segment_indices = [-1, -1]
        for i in range(len(self.contour)):
            coord = self.contour[i]
            prev_coord = self.contour[i - 1]

            if test_same_line(prev_coord, coord, is_hori, fold_line_axis):
                if not started:
                    started = True
                    segment_indices[0] = i

                segment_indices[1] = i + 1
            else:
                if started:
                    started = False
                    fold_line_indices.append(segment_indices)
                    segment_indices = [-1, -1]

        # print(fold_line_indices)

        # skip the points on the fold line and rearrange contour points so
        # the first point is the point right after the last fold line point
        last_index = fold_line_indices[-1][1]
        new_contour = self.contour[last_index:]
        for i in range(len(fold_line_indices)):
            indices = fold_line_indices[i]
            if i == 0:
                new_contour.extend(self.contour[0 : indices[0]])
            else:
                prev = fold_line_indices[i - 1]
                new_contour.extend(self.contour[prev[1] + 1 : indices[0]])

        # update contour
        self.contour = new_contour
        num_points = len(self.contour)
        # print(self.contour)

        # add the new mirrorred points
        for i in reversed(range(num_points)):
            coord = self.contour[i]
            if fold_line == "bottom":
                new_y_coord = fold_line_axis - coord[1] + fold_line_axis
                self.contour.append([coord[0], new_y_coord])

            elif fold_line == "top":
                new_y_coord = fold_line_axis - (coord[1] - fold_line_axis)
                self.contour.append([coord[0], new_y_coord])

            elif fold_line == "left":
                new_x_coord = fold_line_axis - (coord[0] - fold_line_axis)
                self.contour.append([new_x_coord, coord[1]])

            else:
                new_x_coord = fold_line_axis - coord[0] + fold_line_axis
                self.contour.append([new_x_coord, coord[1]])

        # update shape and bounding box traits
        if fold_line == "top":
            self.y -= self.height
            self.bbox_low_y -= self.height
        elif fold_line == "left":
            self.x -= self.width
            self.bbox_low_x -= self.width

        if is_hori:
            self.bbox_h += self.height
            self.height = self.height * 2
        else:
            self.bbox_w += self.width
            self.width = self.width * 2

    def findCorners(self):
        """
        Finding corners of the shape. Ignore for now, but might be useful later on?
        """
        SPACE = 20
        max_x = (int)(self.x + self.width + SPACE)
        max_y = (int)(self.y + self.height + SPACE)

        mask = np.zeros((max_y, max_x), dtype="uint8")
        points = np.array(self.contour)
        cv.fillPoly(mask, np.int32([points]), (255, 255, 255))

        dst = cv.cornerHarris(mask, 5, 3, 0.04)
        ret, dst = cv.threshold(dst, 0.1 * dst.max(), 255, 0)
        dst = np.uint8(dst)
        ret, labels, stats, centroids = cv.connectedComponentsWithStats(dst)
        criteria = (cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER, 100, 0.001)
        corners = cv.cornerSubPix(
            mask, np.float32(centroids), (5, 5), (-1, -1), criteria
        )

        # convert to integer
        centroids = np.int0(centroids)
        corners = np.int0(corners)

        # print(corners)
        # print(centroids)

        return corners

    def move_bbox_list(self, new_bbox_low_x, new_bbox_low_y):
        """
        For slice nesting, move all rectangles making up a polygon boundary
        """

        x_move = new_bbox_low_x - self.bbox_low_x
        y_move = new_bbox_low_y - self.bbox_low_y

        for box in self.bbox_list:
            box[0][0] += x_move
            box[1][0] += x_move
            box[0][1] += y_move
            box[1][1] += y_move
