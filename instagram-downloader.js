/**
 * This script is used to download the images from an instagram page.
 *
 * How to:
 * 1. Open the instagram page
 * 2. Scroll all the way down
 * 3. Run this script in the console
 * 4. A popup in chrome will appear that asks for permission to download multiple files, click on allow
 * 5. The images will be downloaded to the current downloads directory
 */

// First run the getter function
async function getImages() {
  const images = document.querySelectorAll("img");
  const imageUrls = new Set();

  images.forEach((img) => {
    let url = img.src;

    if (url.includes("scontent") && url.includes("instagram")) {
      imageUrls.add(url);
    }
  });

  const uniqueUrls = Array.from(imageUrls);
  console.log(`Found ${uniqueUrls.length} unique Instagram images:`);
  uniqueUrls.forEach((url) => console.log(url));

  return uniqueUrls;
}

// Then run the improved downloader
async function downloadHighResImages() {
  const urls = await getImages();

  for (let i = 0; i < urls.length; i++) {
    try {
      const response = await fetch(urls[i]);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `instagram-image-${i + 1}.jpg`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to download image ${i + 1}:`, error);
    }
  }
}

// Run this to start the download process
downloadHighResImages();
