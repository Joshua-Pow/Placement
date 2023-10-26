import cv2 as cv
import numpy as np
from pdf2image import pdf2image

# convert pdf to jpg (opencv cannot read pdf)
def convert_to_jpg(filename: str): 
    pdf_images = pdf2image.convert_from_path('pattern.pdf')

    for i in range(len(pdf_images)):
        pdf_images[i].save('pattern_page_' + str(i+1) + '.jpg')
    print("ok")


def extract_from_image(filename: str): 
    '''
    extract
    '''
    im = cv.imread(filename)
    assert im is not None, "file could not be read, check with os.path.exists()"


    # Convert the img to grayscale
    imgray = cv.cvtColor(im, cv.COLOR_BGR2GRAY)

    # canny edge detector
    imedged = cv.Canny(imgray, 10, 100)

    # dilation -> make edges thicker so pixels in a connected curve can be detected as a continous contour
    kernel = np.ones((5,5),np.uint8)
    im_dilated = cv.dilate(imedged,kernel,iterations = 1)

    # debug
    #cv.imshow('im', im_dilated)
    #cv.waitKey()

    ret, thresh = cv.threshold(im_dilated, 127, 255, 0)
    contours, hierarchy = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    print("extracted:", len(contours), "contours")

    # draw contours on original image
    cv.drawContours(im, contours, -1, (0,255,0), 3)

    # Show in a window
    # cv.imshow('Contours', im)
    # cv.waitKey()
    type(contours)
    return contours

def convert_contours_vector_to_svg_path(contours, image_height, image_width):
    for c in contours:
        print(len(c))

    # height, width = imgray.shape
    print("height:", image_height, "width:", image_width)
    with open("simple_shapes.svg", "w+") as f:
        f.write(f'<svg width="{image_width}" height="{image_height}" xmlns="http://www.w3.org/2000/svg">')

        for c in contours:
            f.write('<path d="M')
            for i in range(len(c)):
                x, y = c[i][0]
                f.write(f"{x} {y} ")
            f.write('Z" fill="none" stroke="blue" stroke-width="3"/>')
        f.write("</svg>")
