from PIL import Image
from pathlib import Path


def content_rows(alpha, width: int, threshold: int = 35, min_ratio: float = 0.015):
    top = None
    bottom = None
    min_pixels = max(1, int(width * min_ratio))

    for y in range(alpha.height):
        count = 0
        for x in range(width):
            if alpha.getpixel((x, y)) > threshold:
                count += 1
        if count >= min_pixels:
            if top is None:
                top = y
            bottom = y

    return top, bottom


def content_cols(alpha, height: int, threshold: int = 35, min_ratio: float = 0.01):
    left = None
    right = None
    min_pixels = max(1, int(height * min_ratio))

    for x in range(alpha.width):
        count = 0
        for y in range(height):
            if alpha.getpixel((x, y)) > threshold:
                count += 1
        if count >= min_pixels:
            if left is None:
                left = x
            right = x

    return left, right


def tight_crop(path: Path, margin_x: int = 8, margin_y: int = 3) -> None:
    im = Image.open(path).convert('RGBA')
    alpha = im.split()[3]
    width, height = im.size

    top, bottom = content_rows(alpha, width)
    left, right = content_cols(alpha, height)

    if None in (top, bottom, left, right):
        raise ValueError(f'Could not detect logo bounds in {path}')

    left = max(0, left - margin_x)
    top = max(0, top - margin_y)
    right = min(width, right + margin_x)
    bottom = min(height, bottom + margin_y)

    cropped = im.crop((left, top, right, bottom))
    cropped.save(path, optimize=True)
    print(f'{path.name}: {im.size} -> {cropped.size}')


logo_dir = Path(__file__).resolve().parents[1] / 'public' / 'logo'
source = logo_dir / 'autoslafe_n_sin_fondo.original.png'
target = logo_dir / 'autoslafe_n_sin_fondo.png'

Image.open(source).save(target)
tight_crop(target)
