import cv2 # for image processing
import os # for operating system related task
import numpy as np
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense,Activation,Flatten,Dropout
from keras.layers import Conv2D,MaxPooling2D
from keras.callbacks import ModelCheckpoint
from sklearn.model_selection import train_test_split
from matplotlib import pyplot as plt

# step - 1 creating the categories of emotion list and labels
data_path='data'
# categories emotions list
categories=os.listdir(data_path)
labels=[i for i in range(len(categories))]

label_dict=dict(zip(categories,labels))

print(label_dict)
print(categories)
print(labels)

# Step - 2: Detecting face 
# using haarcascade technique
img_size=100
data=[]
target=[]

facedata = "haarcascade_frontalface_alt.xml"
cascade = cv2.CascadeClassifier(facedata)

for category in categories:
    folder_path=os.path.join(data_path,category)
    img_names=os.listdir(folder_path)
        
    for img_name in img_names:
        img_path=os.path.join(folder_path,img_name)
        img=cv2.imread(img_path)
        faces = cascade.detectMultiScale(img)
        try:
            for f in faces:
                # detecing the faces in each image
                # using list compregnetion
                # face corrdinates
                x, y, w, h = [v for v in f] 
                # cropping only faces
                sub_face = img[y:y + h, x:x + w] 
                # coverting the img into gray filter
                gray=cv2.cvtColor(sub_face,cv2.COLOR_BGR2GRAY)  
                # resize image to img_size=100         
                resized=cv2.resize(gray,(img_size,img_size))
                data.append(resized)
                target.append(label_dict[category])
        except Exception as e:
            print('Exception:',e)

# Step 3 Reshaping the data
# using normalization technique
data=np.array(data)/255.0
data=np.reshape(data,(data.shape[0],img_size,img_size,1))
target=np.array(target)

# step 4 Converting into categorical values
new_target=np_utils.to_categorical(target)
# saving targets in npy file
np.save('./training/data',data)
np.save('./training/target',new_target)

# Step 5 Training the Convolutional Neural Network
# loading data to main memory
data=np.load('./training/data.npy')
target=np.load('./training/target.npy')

# step 6 Loading keras library for neural networks
model=Sequential()

# The first cnn layer
# followed by relu and maxpooling layers
model.add(Conv2D(200,(3,3),input_shape=data.shape[1:]))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2,2)))

# The second layer
# followed by relu and maxpooling layers
model.add(Conv2D(100,(3,3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2,2)))

# Flatten layer to stack the output convolutions from second layer
model.add(Flatten())
model.add(Dropout(0.5))

# Dense layer of 64 neurons
model.add(Dense(50,activation='relu'))

# Final layer with two outputs for two categories
model.add(Dense(7,activation='softmax')) # change out to ur types of emotions available
model.compile(loss='categorical_crossentropy',optimizer='adam',metrics=['accuracy'])

# step 7 splitted data into training and testing
# validation techquie from which we will know our model is prefect
train_data,test_data,train_target,test_target=train_test_split(data,target,test_size=0.1)

# step 8 starting the training procedure
# saving training in model file
checkpoint = ModelCheckpoint('./training/model-{epoch:03d}.model',monitor='val_loss',verbose=0,save_best_only=True,mode='auto')
# selecting epochs = 12 for more accuracy
history=model.fit(train_data,train_target,epochs=12,callbacks=[checkpoint],validation_split=0.2)

# plotting the graph
# for viewing how the model is accurate in valitation and training
plt.plot(history.history['loss'],'r',label='training loss')
plt.plot(history.history['val_loss'],label='validation loss')
plt.xlabel('# epochs')
plt.ylabel('loss')
plt.legend()
plt.show()

plt.plot(history.history['accuracy'],'r',label='training accuracy')
plt.plot(history.history['val_accuracy'],label='validation accuracy')
plt.xlabel('# epochs')
plt.ylabel('loss')
plt.legend()
plt.show()

print(model.evaluate(test_data,test_target))