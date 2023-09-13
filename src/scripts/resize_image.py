import fire
from PIL import Image


def resize_image(input_path: str, output_path: str, new_width: int) -> None:
    img = Image.open(input_path)
    width, height = img.size

    new_height = int(new_width * height / width)
    resized_img = img.resize((new_width, new_height))
    resized_img.save(output_path, "PNG")


if __name__ == "__main__":
    fire.Fire(resize_image)
