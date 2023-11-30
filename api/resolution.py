import json


class Resolution(object):
    """
    Resolution class contains attributes
    relating to the original pdf input
    """

    def __init__(self, pdf_width, pdf_height, path):
        """
        pdf_width: number of pixels horizontally
        pdf_height: number of pixels vertically
        path: orginal PDF name
        """
        assert pdf_width > 0 and pdf_height > 0

        self.width = pdf_width #Pixels
        self.height = pdf_height
        self.path = path

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
    

    def get_scaling_factor(self, unit="inch"):
        """
        Get a scaling factor to pixel number to cm or inch number
        unit: cm or inches

        example usage:
        scale = get_scaling_factor(unit="inch")
        actual_fabric_length = bounding_box_length * scale
        """
        if (unit[0]=="i") { #inch
            return ((self.output_width_inch*self.output_height_inch) / (self.width*self.height))
        }
        return ((self.output_width_cm*self.output_height_cm) / (self.width*self.height))


    def get_real_world_yardage(self, bounding_box_length, unit="inch"):
        """
        returns a final yardage measurement of the new pattern layout after nesting algorithms
        bounding_box_length: a pixel number
        """
        return bounding_box_length * get_scaling_factor(unit)
