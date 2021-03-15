import torchvision
import torch.backends.cudnn as cudnn
import torchvision.models as models
import torchvision.datasets as datasets
import torch.optim as optim
import torch.nn as nn
import torch
import albumentations as A
from albumentations.pytorch import ToTensorV2
#import albumentations.augmentations.transforms as AT

import os
from tqdm import tqdm

#alexnet, resnet50, densenet121, vgg16
#note about data set,a = 00, b = 01, ... 
# 10 and 25 are missing because j and z are skipped
# because they require motion


def train(epochs, trainloader,save_path,device):
  model = models.alexnet(num_classes=24).to(device)
  criterion = nn.CrossEntropyLoss()
  optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

  #use torchvision.datasets.ImageFolder prob
  for epoch in tqdm(range(1,epochs+1)):  # loop over the dataset multiple times


    running_loss = 0.0
    for i, data in enumerate(trainloader, 0):
        # get the inputs; data is a list of [inputs, labels]
        inputs, labels = data[0].to(device), data[1]

        # zero the parameter gradients
        optimizer.zero_grad()

        # forward + backward + optimize
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        # print statistics
        running_loss += loss.item()
        if epoch % 10 == 0:
          torch.save({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'loss': running_loss,
            }, os.path.join(save_path,
            f"epoch_{epoch:02d}.pth.tar"))
        if i % 2000 == 1999:    # print every 2000 mini-batches
            print('[%d, %5d] loss: %.3f' %
                  (epoch + 1, i + 1, running_loss / 2000))
            # also save model


            running_loss = 0.0

  print('Finished Training')
  torch.save(model.state_dict(),os.path.join(save_path,'final_model.pth.tar'))


def test(model,load_path,testloader,device,bsize=256):
  classes = [chr(i+65) for i in range(26) if i != 25 and i != 9]
  model.load_state_dict(torch.load(os.path.join(load_path, 'final_model.pth.tar'))).to(device)

  correct = 0
  total = 0
  class_correct = list(0. for i in range(len(classes)))
  class_total = list(0. for i in range(len(classes)))
  with torch.no_grad():
      for data in tqdm(testloader):
          images, labels = data[0].to(device), data[1]
          outputs = model(images)
          _, predicted = torch.max(outputs, 1)
          total += labels.size(0)
          correct += (predicted == labels).sum().item()
          c = (predicted == labels).squeeze()
          for i in range(bsize):
              label = labels[i]
              class_correct[label] += c[i].item()
              class_total[label] += 1

  for i in range(len(classes)):
    print('Accuracy of %5s : %2d %%' % (
        classes[i], 100 * class_correct[i] / class_total[i]))

  print('Total Accuracy of the network: %d %%' % (100 * correct / total))

def main():
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  cudnn.benchmark = True

  torch.manual_seed(42)

  print(f"Using: {device}")

  data_folder = "data"

  training_transforms = A.Compose(
    [
      A.RandomBrightnessContrast(p=0.5),
      A.GaussianBlur(),
      A.ColorJitter(),
      A.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
      ToTensorV2()
    ]
  )

  testing_transforms = A.Compose(
    [
      A.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
      ToTensorV2()
    ]
  )

  BATCHSIZE = 256
  training_set = datasets.ImageFolder(os.path.join(data_folder,'train'), transform=training_transforms)
  trainerloader = torch.utils.data.DataLoader(training_set, batch_size=BATCHSIZE, shuffle=True, num_workers=20, pin_memory=True)

  test_set = datasets.ImageFolder(os.path.join(data_folder,'test'), transform=testing_transforms)
  testloader = torch.utils.data.DataLoader(test_set, batch_size=BATCHSIZE, shuffle=True, num_workers=20, pin_memory=True)
  train(50,trainerloader,'saved_models',device)
  test(models.alexnet(num_classes=24).to(device),'saved_models',testloader,device,bsize=BATCHSIZE)







if __name__ == "__main__":
  main()
