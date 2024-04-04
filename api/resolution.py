from typing import Literal
from api.polygon import Polygon


class Resolution(object):
    """
    Resolution class contains attributes
    relating to the original pdf input
    """

    def __init__(
        self,
        pdf_width: int,
        pdf_height: int,
        fabric_width: int,
        fabric_unit: Literal["cm", "inch"],
    ):
        """
        pdf_width: number of pixels horizontally
        pdf_height: number of pixels vertically
        path: orginal PDF name
        """
        # TODO: add assertions
        # assert pdf_width > 0 and pdf_height > 0 and fabric_width > 0
        assert fabric_unit in ["cm", "inch"]

        self.pdf_width = pdf_width  # Pixels
        self.pdf_height = pdf_height

        self.fabric_width = fabric_width  # Real world dimensions
        self.fabric_unit = fabric_unit

        """
        The A0 paper size is 84.1 cm x 118.9 cm or 33.1 inches x 46.8 inches
        """
        self.output_width_cm = 84.1
        self.output_height_cm = 118.9
        self.output_width_inch = 33.1
        self.output_height_inch = 46.8
        self.open_cv_compression_w = 0.35
        self.open_cv_compression_h = 0.29

    def __repr__(self):
        return f"pdf resolution is width = {self.pdf_width} pixels, height = {self.pdf_height} pixels\nfabric width = {self.fabric_width} {self.fabric_unit}"

    def get_final_yardage(self, polygonArray: list[Polygon], unit="inch") -> float:
        """
        Calculate final pattern yardage requirement given array of polygons
        Returns a float representing the yardage required
        polygonArray: a list of Polygon types containing bbox_low_x/y and width/height
        unit: cm or inches
        """
        pixel_h = self._get_bounding_box_length(polygonArray)
        #print(f"pixel_height is {pixel_h}, scaling factor is {self._get_scaling_factor(unit)}")
        #print(f" *** final yardage is {pixel_h * self._get_scaling_factor(unit) / self.open_cv_compression_h}")
        return pixel_h * self._get_scaling_factor(unit) / self.open_cv_compression_h

    def _get_scaling_factor(self, unit="inch"):
        """
        Get a scaling factor to pixel number to cm or inch number
        unit: cm or inches
        example usage:
        scale = get_scaling_factor(unit="inch")
        actual_fabric_length = bounding_box_length * scale
        """
        #print(f"!! pdf_height = {self.pdf_height}, output_inch = {self.output_height_inch}")
        if unit[0] == "i":  # inch
            return self.output_height_inch / self.pdf_height

        return self.output_height_cm / self.pdf_height

    def _get_bounding_box_length(self, polygonArray: list[Polygon]):
        """
        returns max y coordinate in all polygon bounding boxes
        polygonArray: a list of Polygon types containing bbox_low_x/y and width/height
        """
        current_length = 0

        for polygon in polygonArray:
            if polygon.y + polygon.height > current_length:
                current_length = polygon.y + polygon.height
        return current_length

    def _get_bounding_box_width_limit(self):
        """
        returns a pixel value representing the fabric width scaled to the input pdf dimensions
        """
        if self.fabric_unit[0] == "i":
            a0_width = self.output_width_inch
        else:
            a0_width = self.output_height_cm
        #print(f"pdf_width={self.pdf_width}, a0_width={a0_width}, fabric_wdith={self.fabric_width}")
        #print(f"\nreturning = {self.pdf_width / a0_width * self.fabric_width * self.open_cv_compression_w}")
        return self.pdf_width / a0_width * self.fabric_width * self.open_cv_compression_w
