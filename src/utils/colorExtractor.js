// Canvas-based dominant color extractor
// Extracts average/dominant colors from album art to dynamically power ambient glowing elements.

export const getDominantColor = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve({
        rgb: "244, 63, 94", // rose-500 fallback
        rgba: "rgba(244, 63, 94, 0.5)",
        hex: "#f43f5e"
      });
      return;
    }

    const img = new Image();
    // Enable cross-origin resource sharing to avoid tainted canvas errors
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 10;
        canvas.height = 10;
        
        ctx.drawImage(img, 0, 0, 10, 10);
        const imgData = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0, g = 0, b = 0, count = 0;
        
        // Sum up colors that are neither too dark nor too bright (rich colors)
        for (let i = 0; i < imgData.length; i += 4) {
          const pr = imgData[i];
          const pg = imgData[i + 1];
          const pb = imgData[i + 2];
          
          // Calculate brightness
          const brightness = (pr * 299 + pg * 587 + pb * 114) / 1000;
          
          // Filter out near-black and near-white pixels for rich tone extraction
          if (brightness > 25 && brightness < 230) {
            r += pr;
            g += pg;
            b += pb;
            count++;
          }
        }

        // Fallback if all pixels were filtered out
        if (count === 0) {
          for (let i = 0; i < imgData.length; i += 4) {
            r += imgData[i];
            g += imgData[i + 1];
            b += imgData[i + 2];
            count++;
          }
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        resolve({
          rgb: `${r}, ${g}, ${b}`,
          rgba: `rgba(${r}, ${g}, ${b}, 0.5)`,
          hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        });
      } catch (err) {
        console.warn("CORS limitation or tainted canvas: falling back to station theme color", err);
        resolve(null);
      }
    };

    img.onerror = () => {
      resolve(null);
    };
  });
};
