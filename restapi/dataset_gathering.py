import cv2

# capturing video from web cam
cam = cv2.VideoCapture(0)
currentframe = 0

# do infinte loop
while (True):
    # reading the web cam
    ret, frame = cam.read()
    # specifying the directory
    name = './data/angry/' + str(currentframe) + '.jpg'
    # creating the dataset gathering procedure
    print('Creating...' + name)
    cv2.imwrite(name, frame)
    currentframe += 1
    # collecting 380 images for dataset
    if currentframe>380:
        break
    cv2.imshow('img', frame)
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# web cam resources been released
cam.release()
cv2.destroyAllWindows()
print()