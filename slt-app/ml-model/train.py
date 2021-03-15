import torch.backends.cudnn as cudnn
import torchvision.models as models
import torchvision.datasets as datasets
import torch.optim as optim
import torch.nn as nn
import torch
import torchvision.transforms as transforms

import os
from tqdm import tqdm
import argparse

# alexnet, resnet50, densenet121, vgg16
# note about data set,a = 00, b = 01, ...
# 10 and 25 are missing because j and z are skipped
# because they require motion


def create_dir(dir_name):
    if not os.path.exists(os.path.join(dir_name)):
        print("saved_models folder not found, creating...")
        os.mkdir(os.path.join(dir_name))
        print("done")
    else:
        print("folder exists, good to go...")


def train(epochs, trainloader, save_path, device):
    model = models.alexnet(num_classes=24).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.001, momentum=0.9)

    # use torchvision.datasets.ImageFolder prob
    for epoch in tqdm(range(1, epochs + 1)):  # loop over the dataset multiple times

        running_loss = 0.0
        for i, data in enumerate(trainloader, 0):
            # get the inputs; data is a list of [inputs, labels]
            inputs, labels = data[0].to(device), data[1].to(device)

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
                with open(
                    os.path.join(save_path, f"epoch_{epoch:02d}.pth.tar"), "wb"
                ) as f:
                    torch.save(
                        {
                            "epoch": epoch,
                            "model_state_dict": model.state_dict(),
                            "optimizer_state_dict": optimizer.state_dict(),
                            "loss": running_loss,
                        },
                        f,
                    )
            if i % 200 == 199:  # print every 200 mini-batches
                print("[%d, %5d] loss: %.3f" % (epoch + 1, i + 1, running_loss / 200))
                # also save model

                running_loss = 0.0

    print("Finished Training")
    with open(os.path.join(save_path, "final_model.pth.tar"), "wb") as f:
        torch.save(model.state_dict(), f)


def test(model, load_path, testloader, device, bsize=256):
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]

    # load model
    model.load_state_dict(torch.load(os.path.join(load_path, "final_model.pth.tar")))
    model.to(device)

    # call evail() to set dropout and batch normalization layers to evaluation mode before running inference.
    # Failing to do this will yield inconsistent inference results.
    # If you wish to resuming training, call model.train() to ensure these layers are in training mode.
    model.eval()

    correct = 0
    total = 0
    class_correct = list(0.0 for i in range(len(classes)))
    class_total = list(0.0 for i in range(len(classes)))
    with torch.no_grad():
        for data in tqdm(testloader):
            images, labels = data[0].to(device), data[1].to(device)
            print(labels.shape)
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
        print(
            "Accuracy of %5s : %2d %%"
            % (classes[i], 100 * class_correct[i] / class_total[i])
        )

    print("Total Accuracy of the network: %d %%" % (100 * correct / total))


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "mode", type=str, help="whether to train or test", choices=["train", "test"]
    )
    parser.add_argument(
        "--data-path",
        type=str,
        help="path to data folder for images, defaults to 'data'",
        default="data",
    )

    parser.add_argument(
        "--save-path",
        type=str,
        help="path to save model while training. attempts to create folder if one does not exist. deafault - 'saved_models'",
        default="saved_models",
    )

    parser.add_argument(
        "--epochs", type=int, help="number of epochs to train for", default=75
    )

    parser.add_argument(
        "--model-type",
        type=str,
        help="type of model to train or test",
        choices=["alexnet", "resnet", "densenet", "vgg"],
        default="alexnet",
    )

    parser.add_argument(
        "--train-all",
        help="whether or not to train all model types at once, in different folders. overrides --model-type",
        action="store_true",
    )

    parser.add_argument(
        "--batch-size",
        type=int,
        help="size of batches for training/testing. deafult = 256",
        default=256,
    )

    args = parser.parse_args()

    SAVED_MODELS_FOLDER = "saved_models"
    EPOCHS = 75
    BATCHSIZE = 256
    NUM_CLASSES = 24
    DATA_FOLDER = "data"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    cudnn.benchmark = True

    torch.manual_seed(42)

    print(f"Using: {device}")

    print("checking for saved_models folder...")
    create_dir(SAVED_MODELS_FOLDER)
    training_transforms = transforms.Compose(
        [
            transforms.GaussianBlur(11, sigma=(0.1, 2.0)),
            transforms.ColorJitter(),
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ]
    )

    testing_transforms = transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
        ]
    )

    training_set = datasets.ImageFolder(
        os.path.join(DATA_FOLDER, "train"), transform=training_transforms
    )
    trainerloader = torch.utils.data.DataLoader(
        training_set,
        batch_size=BATCHSIZE,
        shuffle=True,
        num_workers=20,
        pin_memory=True,
    )

    test_set = datasets.ImageFolder(
        os.path.join(DATA_FOLDER, "test"), transform=testing_transforms
    )
    testloader = torch.utils.data.DataLoader(
        test_set, batch_size=BATCHSIZE, shuffle=True, num_workers=20, pin_memory=True
    )
    train(EPOCHS, trainerloader, SAVED_MODELS_FOLDER, device)
    test(
        models.alexnet(num_classes=NUM_CLASSES),
        SAVED_MODELS_FOLDER,
        testloader,
        device,
        bsize=BATCHSIZE,
    )


# TODO: use arg_parse
# training or testing -
# training -
# specify number of epochs
# model type
# save path
# batch size
# seed
# testing
# load path


if __name__ == "__main__":
    main()
