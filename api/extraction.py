import cv2 as cv
import numpy as np
from pdf2image import pdf2image


def convert_pdf_to_png(filename: str):
    """
    Converts a pdf to individual png images and save them in the api/pattern_images folder.

        Parameters:
            filename (str): path to a pdf file

        Returns:
            image_paths: list of output image paths
    """

    pdf_images = pdf2image.convert_from_path(filename)

    image_paths = []
    for i in range(len(pdf_images)):
        output_path = "./api/pattern_images/pattern_page_" + str(i + 1) + ".png"
        pdf_images[i].save(output_path)
        image_paths.append(output_path)

    return image_paths


def extract_from_image(filename_paths):
    """
    Extracts shape contours from an image and save as SVG paths.

        Parameters:
            filename_paths: paths to images

        Returns:
            output_svg_path: path to SVG file
    """

    all_contours = []
    pages_height = []
    total_height = 0

    for i in range(len(filename_paths)):
        filename = filename_paths[i]
        im = cv.imread(filename)
        assert im is not None, "file could not be read, check with os.path.exists()"

        # Convert the img to grayscale
        imgray = cv.cvtColor(im, cv.COLOR_BGR2GRAY)

        # canny edge detector
        imedged = cv.Canny(imgray, 10, 100)

        # dilation of image to make edges thicker so pixels in a connected curve can be detected as a continous contour
        kernel = np.ones((5, 5), np.uint8)
        im_dilated = cv.dilate(imedged, kernel, iterations=1)

        # debug
        # cv.imshow('im', im_dilated)
        # cv.waitKey()

        ret, thresh = cv.threshold(im_dilated, 127, 255, 0)
        contours, hierarchy = cv.findContours(
            thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE
        )
        print("extracted:", len(contours), "contours")

        # draw contours on original image
        cv.drawContours(im, contours, -1, (0, 255, 0), 3)

        # Show in a window
        # cv.imshow('Contours', im)
        # cv.waitKey()

        """ 
        for c in contours:
            print(len(c))
        """

        all_contours.append(contours)

        height, width = imgray.shape

        pages_height.append(height)
        total_height += height

    # save to a svg file
    output_svg_path = "./api/simple_shapes.svg"
    with open(output_svg_path, "w+") as f:
        f.write(
            f'<svg viewBox="0 0 {width} {total_height}" xmlns="http://www.w3.org/2000/svg">'
        )

        for i in range(len(all_contours)):
            contours = all_contours[i]
            for c in contours:
                f.write('<path d="M')
                for j in range(len(c)):
                    x, y = c[j][0]
                    if i != 0:
                        y += pages_height[i - 1]
                    f.write(f"{x} {y} ")
                f.write('Z" fill="none" stroke="#6d28d9" stroke-width="15"/>')
        f.write("</svg>")

    return output_svg_path
