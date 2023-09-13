import fire
from PIL import Image, ImageDraw


def circular_crop(input_path: str, output_path: str) -> None:
    img = Image.open(input_path)
    width, height = img.size

    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, width, height), fill=255)

    circular_img = Image.composite(img, Image.new("RGBA", img.size, (0, 0, 0, 0)), mask)
    circular_img.save(output_path, "PNG")


if __name__ == "__main__":
    fire.Fire(circular_crop)
