/**
 * This script is used to download the images from an instagram page.
 *
 * How to:
 * 1. Open the instagram page
 * 2. Press F12 or right click -> inspect, ignore the STOP message (lmao)
 * 3. Copy this entire file and paste it in the console, press enter
 * 4. A popup in chrome will appear that asks for permission to download multiple files, click on allow
 * 5. The script will automatically scroll and download all images
 */

// Set to track already processed images
const processedUrls = new Set();
let totalDownloaded = 0;

async function getImages() {
  const images = document.querySelectorAll("img");
  const imageUrls = new Set();

  images.forEach((img) => {
    let url = img.src;

    if (
      url.includes("scontent") &&
      url.includes("instagram") &&
      !processedUrls.has(url)
    ) {
      imageUrls.add(url);
      processedUrls.add(url);
    }
  });

  const uniqueUrls = Array.from(imageUrls);
  console.log(`Found ${uniqueUrls.length} new Instagram images`);

  return uniqueUrls;
}

async function scrollDown() {
  const scrollHeight = document.body.scrollHeight;
  window.scrollTo(0, scrollHeight);

  console.log("Scrolled down, waiting for new images to load...");

  // Wait for new content to load
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

async function downloadImages(urls) {
  for (let i = 0; i < urls.length; i++) {
    try {
      const response = await fetch(urls[i]);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `instagram-image-${totalDownloaded + i + 1}.jpg`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `Failed to download image ${totalDownloaded + i + 1}:`,
        error
      );
    }
  }

  totalDownloaded += urls.length;
  console.log(`Total images downloaded: ${totalDownloaded}`);
}

async function downloadAllImages(maxScrolls = 30) {
  console.log("Starting Instagram image downloader...");
  console.log("The script will scroll and download automatically.");

  let previousImageCount = 0;
  let noNewImagesCount = 0;

  for (let scrollCount = 0; scrollCount < maxScrolls; scrollCount++) {
    // Get and download current images
    const newImages = await getImages();

    if (newImages.length > 0) {
      await downloadImages(newImages);
      previousImageCount = processedUrls.size;
      noNewImagesCount = 0; // Reset the counter when we find new images
    } else {
      noNewImagesCount++;
      console.log(`No new images found after scroll (${noNewImagesCount})`);

      // If no new images after 3 consecutive scrolls, we're probably done
      if (noNewImagesCount >= 3) {
        console.log("No new images after multiple scrolls. Finishing...");
        break;
      }
    }

    // Scroll down to load more content
    await scrollDown();
  }

  console.log(`Finished downloading ${totalDownloaded} images from Instagram!`);
}

// Run this to start the download process
downloadAllImages();
