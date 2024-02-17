import json


class Resolution(object):
    """
    Resolution class contains attributes
    relating to the original pdf input
    """

    def __init__(self, pdf_width, pdf_height, fabric_width, fabric_unit):
        """
        pdf_width: number of pixels horizontally
        pdf_height: number of pixels vertically
        path: orginal PDF name
        """
        assert pdf_width > 0 and pdf_height > 0 and fabric_width > 0
        assert fabric_unit in ["cm", "inch"]

        self.pdf_width = pdf_width #Pixels
        self.pdf_height = pdf_height

        self.fabric_width = fabric_width #Real world dimensions
        self.fabric_unit = fabric_unit

        """
        The A0 paper size is 84.1 cm x 118.9 cm or 33.1 inches x 46.8 inches
        """
        self.output_width_cm = 84.1
        self.output_height_cm = 118.9
        self.output_width_inch = 33.1
        self.output_height_inch = 46.8


    def __repr__(self):
        return "pdf resolution is width = {} pixels, height = {} pixels".format(
            self.width, self.height
        )

    def get_final_yardage(self, polygonArray, unit="inch"):
        """
        Calculate final pattern yardage requirement given array of polygons
        Returns a tuple representing width, height in specified units
        polygonArray: a list of Polygon types containing bbox_low_x/y and width/height
        unit: cm or inches
        """
        pixel_h = self._get_bounding_box_length(self, polygonArray)
        #real_width = self._get_real_world_yardage(self, pixel_w_h[0], unit) #only need the height for yardage
        return pixel_h * self._get_scaling_factor(unit)

    def _get_scaling_factor(self, unit="inch"):
        """
        Get a scaling factor to pixel number to cm or inch number
        unit: cm or inches
        example usage:
        scale = get_scaling_factor(unit="inch")
        actual_fabric_length = bounding_box_length * scale
        """
        if (unit[0]=="i"): #inch
            return (output_height_inch / self.pdf_height)

        return (self.output_height_cm / self.pdf_height)


    def _get_bounding_box_length(self, polygonArray):
        """
        returns max y coordinate in all polygon bounding boxes
        polygonArray: a list of Polygon types containing bbox_low_x/y and width/height
        """
        current_length = 0

        for polygon in polygonArray:
            current_length = max(current_length,polygon.bbox_low_y + polygon.height)
        return current_width

    def _get_bounding_box_width_limit(self):
        """
        returns a pixel value representing the fabric width scaled to the input pdf dimensions
        """
        if (self.fabric_unit[0] == 'i'):
            a0_width = self.output_width_inch
        else:
            a0_width = self.output_height_cm

        return pdf_width / a0_width * self.fabric_width