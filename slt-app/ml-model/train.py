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
        print(f"{dir_name} folder not found, creating...")
        os.mkdir(os.path.join(dir_name))
        print("done")
    else:
        print("folder exists, good to go...")


def select_model(model_type: str, num_classes: int, pretrained: bool = False):
    if model_type == "alexnet":
        if pretrained:
            model = models.alexnet(pretrained=pretrained)
            num_ftrs = model.classifier[6].in_features
            model.classifier[6] = nn.Linear(num_ftrs, num_classes)
            return model
        else:
            return models.alexnet(num_classes=num_classes)
    elif model_type == "resnet":
        if pretrained:
            model = models.resnet50(pretrained=pretrained)
            num_ftrs = model.fc.in_features
            model.fc = nn.Linear(num_ftrs, num_classes)
            return model
        else:
            return models.resnet50(num_classes=num_classes)
    elif model_type == "densenet":
        if pretrained:
            model = models.densenet121(pretrained=pretrained)
            num_ftrs = model.classifier.in_features
            model.classifier = nn.Linear(num_ftrs, num_classes)
            return model
        else:
            return models.densenet121(num_classes=num_classes)
    elif model_type == "vgg":
        if pretrained:
            model = models.vgg16(pretrained=pretrained)
            num_ftrs = model.classifier[6].in_features
            model.classifier[6] = nn.Linear(num_ftrs, num_classes)
            return model
        else:
            return models.vgg16(num_classes=num_classes)
    else:
        return None


def train(
    model_type: str,
    num_classes: int,
    epochs: int,
    trainloader,
    save_path: str,
    device,
    pretrain: bool = False,
):
    model = select_model(model_type, num_classes, pretrain)
    model.train()
    assert model is not None, "Invalid model type selected"

    print(f"training {model_type}")
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=0.1, momentum=0.9, weight_decay=1e-4)
    lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=20, gamma=0.1)
    model = model.to(device)
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

            if i % 64 == 63:  # print every 200 mini-batches
                print("[%d, %5d] loss: %.3f" % (epoch + 1, i + 1, running_loss / 64))
                # also save model

                running_loss = 0.0

        lr_scheduler.step()
        if epoch % 10 == 0:
            with open(os.path.join(save_path, f"epoch_{epoch:02d}.pth.tar"), "wb") as f:
                torch.save(
                    {
                        "epoch": epoch,
                        "model_state_dict": model.state_dict(),
                        "optimizer_state_dict": optimizer.state_dict(),
                        "scheduler": lr_scheduler.state_dict(),
                    },
                    f,
                )

    print("Finished Training")
    with open(os.path.join(save_path, "final_model.pth.tar"), "wb") as f:
        torch.save(model.state_dict(), f)


def test(model_type, load_path, testloader, device, bsize=256):
    classes = [chr(i + 65) for i in range(26) if i != 25 and i != 9]

    model = select_model(model_type, 24)
    # load model
    model.load_state_dict(torch.load(os.path.join(load_path, "final_model.pth.tar")))
    model.to(device)

    # call eval() to set dropout and batch normalization layers to evaluation mode before running inference.
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
        "--pretrain",
        help="whether or not to train with models pretrained on ImageNet",
        action="store_true",
    )

    parser.add_argument(
        "--batch-size",
        type=int,
        help="size of batches for training/testing. default = 256",
        default=256,
    )

    parser.add_argument(
        "--seed",
        type=int,
        help="value to seed random number generator, default = 42",
        default=42,
    )

    args = parser.parse_args()

    SAVED_MODELS_FOLDER = args.save_path
    EPOCHS = args.epochs
    BATCHSIZE = args.batch_size
    NUM_CLASSES = 24
    DATA_FOLDER = args.data_path
    SEED = args.seed
    MODEL_TYPE = args.model_type
    PRETRAIN = args.pretrain
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    cudnn.benchmark = True

    torch.manual_seed(SEED)

    print(f"Using: {device}")

    print(f"checking for {SAVED_MODELS_FOLDER} folder...")
    create_dir(SAVED_MODELS_FOLDER)

    if args.mode == "train":
        training_transforms = transforms.Compose(
            [
                transforms.Resize(224),
                transforms.GaussianBlur(11, sigma=(0.1, 2.0)),
                transforms.ColorJitter(),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)
                ),
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
        if args.train_all:
            for model_type in ["alexnet", "resnet", "densenet", "vgg"]:
                save_path = os.path.join(model_type, SAVED_MODELS_FOLDER)
                os.makedirs(save_path, exist_ok=True)
                train(
                    model_type,
                    NUM_CLASSES,
                    EPOCHS,
                    trainerloader,
                    save_path,
                    device,
                    PRETRAIN,
                )
        else:
            train(
                MODEL_TYPE,
                NUM_CLASSES,
                EPOCHS,
                trainerloader,
                SAVED_MODELS_FOLDER,
                device,
                PRETRAIN,
            )
    # testing
    else:

        testing_transforms = transforms.Compose(
            [
                transforms.Resize(224),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)
                ),
            ]
        )

        test_set = datasets.ImageFolder(
            os.path.join(DATA_FOLDER, "test"), transform=testing_transforms
        )
        testloader = torch.utils.data.DataLoader(
            test_set,
            batch_size=BATCHSIZE,
            shuffle=True,
            num_workers=20,
            pin_memory=True,
        )

        test(
            MODEL_TYPE, SAVED_MODELS_FOLDER, testloader, device, bsize=BATCHSIZE,
        )


if __name__ == "__main__":
    main()
