import cv2 # for image processing
import numpy as np
from keras.models import load_model
from sklearn.model_selection import train_test_split
from matplotlib import pyplot as plt

# Step 9 loading the model
# Use the latest created model from training folder
# predection on the live video set
model = load_model('./training/model-012.model')

face_clsfr=cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

cap=cv2.VideoCapture("vb1.mp4")
# size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
# fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # 'x264' doesn't work
# out = cv2.VideoWriter('test1.mp4',fourcc, 29.0, size)  # 'False' for 1-ch instead of 3-ch for color

# creaing dictionary label
# dictionary label should be arranged according to emotion categories in data folder
labels_dict={0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}
# colors of the label
# color_dict={0:(0,0,255),1:(0,255,0),2:(255,0,0),3:(255,0,255)}
color_dict={0:(0,0,255),1:(0,0,255),2:(0,0,255),3:(255,0,255),4:(255,0,255),5:(0,0,255),6:(255,0,255),}
total_res_collection = list()

# Step 10 reading frames one by one
while(True):
    # reading frames
    ret,img=cap.read()
    # converting the frames to gray scale
    if(img is not None):
        gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        # detecting faces in frames
        faces=face_clsfr.detectMultiScale(gray,1.3,3)  

        # Draw a rectangle around the faces
        for (x,y,w,h) in faces:
            # face corrdinates
            face_img=gray[y:y+w,x:x+w]
            # cropping faces
            resized=cv2.resize(face_img,(100,100))
            normalized=resized/255.0
            reshaped=np.reshape(normalized,(1,100,100,1))
            # 0, 1, 2, 3 out put check label dictionary
            result=model.predict(reshaped)

            label=np.argmax(result,axis=1)[0]
            print(result[0])
            print(label)
            print("res:" + str(max(result[0])))

            # print predictions
            print("\nProbabilities are " + str("{:.8f}".format(float(result[0][1])))+"\n")
            print("Emotion is "+ labels_dict.get(label, "Invalid emotion"))
            total_res_collection.append([label, max(result[0])])

            # for rectangle arround the face in video
            cv2.rectangle(img,(x,y),(x+w,y+h),color_dict[label],2)
            cv2.rectangle(img,(x,y-40),(x+w,y),color_dict[label],-1)
            cv2.putText(img, labels_dict[label], (x, y-10),cv2.FONT_HERSHEY_SIMPLEX,0.8,(255,255,255),2)

        # Display the resulting frame
        # cv2.imshow('video',img)
    key=cv2.waitKey(1)
    
    # if user press key it will exit
    if(key==27):
        break
    if ret==False:
        break
print(*total_res_collection, sep = "\n") # * will loop and sep will create new line
print(*labels_dict, sep = "\n") # * will loop and sep will create new line
emotion_res = list()
sum_of_emo_res = 0
for i in range(len(labels_dict)):
    for j in total_res_collection:
        if i == j[0]:
            if i > len(emotion_res) - 1:    
                emotion_res.append(j[1])
            else:
                emotion_res[i] += j[1]
            sum_of_emo_res += j[1]
print(*emotion_res, sep = "\n") # * will loop and sep will create new line
for i in range(len(emotion_res)):
    emotion_res[i] = 100 * emotion_res[i]/sum_of_emo_res
print(*emotion_res, sep = "\n") # * will loop and sep will create new line
depressed_res = emotion_res[0] + emotion_res[1] + emotion_res[2] + emotion_res[5] #angry,disgust,fear,sad
print("Deppressed")
print(depressed_res)
# emotion_res = list()
# sum_of_emo_res = 0
# for i in total_res_collection:
#     # max_emo = np.argmax(i, axis=1)
#     # max_emo = i.index(max(i))
#     print(max(i))
#     for j in range(len(labels_dict)):
#         if j > len(emotion_res) - 1:    
#             emotion_res.append(i[j])
#         else:
#             emotion_res[j] += i[j]
#         sum_of_emo_res += i[j]
            
# print("final")
# for i in range(len(emotion_res)):
#     emotion_res[i] = 100 * emotion_res[i]/sum_of_emo_res
# print(*emotion_res, sep = "\n") # * will loop and sep will create new line
# depressed_res = 0
# depressed_res = emotion_res[0] + emotion_res[1] + emotion_res[2] + emotion_res[5]
# print("Deppressed")
# print(depressed_res)

# When everything is done, release the capture
cv2.destroyAllWindows()
cap.release()