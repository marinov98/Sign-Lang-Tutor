import torch

import torchvision.models as models
import torch.optim as optim
import torch.nn as nn

#alexnet, resnet50, densenet121, vgg16
#note about data set,a = 00, b = 01, ... 
# 10 and 25 are missing because j and z are skipped
# because they require motion


model = models.alexnet(num_classes=24)

criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

def train():
  #TODO: figure this shit out
  #use torchvision.datasets.ImageFolder prob

  pass


