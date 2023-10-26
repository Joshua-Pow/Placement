import cv2 as cv
import numpy as np
from pdf2image import pdf2image


def convert_pdf_to_jpg(filename: str):
    """
    Converts a pdf to individual jpg images and save them in the api/pattern_images folder.

        Parameters:
            filename (str): path to a pdf file
    """

    pdf_images = pdf2image.convert_from_path(filename)

    for i in range(len(pdf_images)):
        pdf_images[i].save("./api/pattern_images/pattern_page_" + str(i + 1) + ".jpg")


def extract_from_image(filename: str):
    """
    Extracts shape contours from an image and save as SVG paths.

        Parameters:
            filename (str): path to a pdf file
    """
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

    height, width = imgray.shape
    print("height:", height, "width:", width)

    # save to a svg file
    with open("./api/simple_shapes.svg", "w+") as f:
        f.write(
            f'<svg height="400" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">'
        )

        for c in contours:
            f.write('<path d="M')
            for i in range(len(c)):
                x, y = c[i][0]
                f.write(f"{x} {y} ")
            f.write('Z" fill="none" stroke="blue" stroke-width="3"/>')
        f.write("</svg>")
