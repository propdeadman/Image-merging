const imageInput = document.getElementById("imageInput");
const combineButton = document.getElementById("combineButton");
const verticalCheckbox = document.getElementById("verticalCheckbox");
const horizontalCheckbox = document.getElementById("horizontalCheckbox");
const downloadLink = document.getElementById("downloadLink");

let images = [];
let combineDirection = "horizontal"; // Default direction

imageInput.addEventListener("change", (event) => {
  images = Array.from(event.target.files);
});

verticalCheckbox.addEventListener("change", () => {
  if (verticalCheckbox.checked) {
    horizontalCheckbox.checked = false;
    combineDirection = "vertical";
  }
});

horizontalCheckbox.addEventListener("change", () => {
  if (horizontalCheckbox.checked) {
    verticalCheckbox.checked = false;
    combineDirection = "horizontal";
  }
});

combineButton.addEventListener("click", async () => {
  if (images.length === 0) {
    alert("Please select images first.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const loadedImages = await Promise.all(
    images.map((image) => loadImage(image))
  );
  const maxWidth = Math.max(...loadedImages.map((img) => img.width));
  const totalHeight = loadedImages.reduce(
    (height, img) => height + img.height,
    0
  );

  if (combineDirection === "vertical") {
    canvas.width = maxWidth;
    canvas.height = totalHeight;
  } else {
    canvas.width = loadedImages.reduce((width, img) => width + img.width, 0);
    canvas.height = Math.max(...loadedImages.map((img) => img.height));
  }

  let x = 0;
  let y = 0;
  loadedImages.forEach((img) => {
    if (combineDirection === "vertical") {
      x = (maxWidth - img.width) / 2;
      ctx.drawImage(img, x, y, img.width, img.height);
      y += img.height;
    } else {
      ctx.drawImage(img, x, y, img.width, img.height);
      x += img.width;
    }
  });

  const combinedImageURL = canvas.toDataURL();
  const fileName = "combined_image.png";
  downloadLink.href = combinedImageURL;
  downloadLink.download = fileName;
  downloadLink.style.display = "block";
});

function loadImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = URL.createObjectURL(file);
  });
}
