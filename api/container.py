class Container(object):
    """
        Defines the container aka fabric attributes
    """
    def __init__(self, fabric_height, fabric_max_length=None):
        """
            fabric_height: fixed input from user
            fabric_max_length: max yardage (NOTE: idk what units we're in, I'm just using whatever rn from the SVG)
        """

        # should be an immutable attribute
        self.fabric_height = fabric_height

        # max length that defines the container
        self.fabric_max_length = fabric_max_length

        # actual length or yardage in use
        self.fabric_length = fabric_max_length

    def update_used_fabric_length(self, new_length):
        self.fabric_length = new_length