from apscheduler.schedulers.background import BackgroundScheduler
from api.models import Session
import cv2 # for image processing
import numpy as np
from keras.models import load_model
from sklearn.model_selection import train_test_split
from matplotlib import pyplot as plt
import decimal

def start():
  print('start job')
  scheduler = BackgroundScheduler()
  scheduler.add_job(predictions, "interval", minutes=1)
  scheduler.start()

def predictions():
    print('Prediction Started')
    session = Session.objects.filter(is_start=False).first()
    if session is not None:
      session.is_start = True
      session.save()
      # Step 9 loading the model
      # Use the latest created model from training folder
      # predection on the live video set
      model = load_model('././training/model-010.model')
      face_clsfr = cv2.CascadeClassifier('././haarcascade_frontalface_alt.xml')
      #   cap=cv2.VideoCapture("././vb1.webm")
      cap = cv2.VideoCapture(session.file.path)

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
      if (len(total_res_collection) > 0):
        for i in range(len(labels_dict)):
            for j in total_res_collection:
                if i == j[0]:
                    if i > len(emotion_res) - 1:    
                        emotion_res.append(j[1])
                    else:
                        emotion_res[i] += j[1]
                    sum_of_emo_res += j[1]
        print(*emotion_res, sep = "\n") # * will loop and sep will create new line
        if (len(emotion_res) > 0):
            for i in range(len(emotion_res)):
                emo_res = decimal.Decimal(100 * emotion_res[i]/sum_of_emo_res)
                if i == 0:
                    session.angry = emo_res
                if i == 1:
                    session.disgust = emo_res
                if i == 2:
                    session.fear = emo_res
                if i == 3:
                    session.happy = emo_res
                if i == 4:
                    session.neutral = emo_res
                if i == 5:
                    session.sad = emo_res
                if i == 6:
                    session.surprise = emo_res
            session.depression_level = session.angry + session.disgust + session.fear + session.sad 
      print("Deppressed")
      print(session.depression_level)
      try:
        pre_session = Session.objects.filter(is_start=True, is_end=True, therapist=session.therapist, client=session.client).last()
        print('Presession')
        print(pre_session.depression_level)
        if pre_session.depression_level > session.depression_level: #83 > 100
            print('pre_session.depression_level > session.depression_level')
            # session.improvement_level = pre_session.depression_level - session.depression_level
             session.improvement_level =  pre_session.depression_level - session.depression_level 
        else: #83 < 100
            print('pre_session.depression_level < session.depression_level')
            # session.improvement_level = session.depression_level - pre_session.depression_level 
           session.improvement_level = session.depression_level - pre_session.depression_level
      except:
        print('previous session doesnt exist')
        pass
      print("Improvement Level")
      print(session.improvement_level)
      session.is_end = True
      session.save()
      # When everything is done, release the capture
      cv2.destroyAllWindows()
      cap.release()
      print('Prediction completed successfully')
    else:
      print('No session to predict')

#   try:
    
#   except Exception as e:
#     print('i am in exception')
#     print(e)
#     pass