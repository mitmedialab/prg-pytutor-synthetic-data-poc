const fs = require("fs").promises;
const path = require("path");

async function renameFilesInDirectory(directory) {
  try {
    const items = await fs.readdir(directory, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(directory, item.name);
      if (item.isDirectory()) {
        await renameFilesInDirectory(fullPath); // Recursively call if item is a directory
      } else if (item.isFile() && path.extname(item.name) === ".txt") {
        const newFullPath = path.join(
          directory,
          path.basename(item.name, ".txt")
        );
        await fs.rename(fullPath, newFullPath);
        console.log(`Renamed ${fullPath} to ${newFullPath}`);
      }
    }
  } catch (error) {
    console.error("Error processing directory:", error);
  }
}

// Replace './output' with the path to your specific folder
renameFilesInDirectory("./output");
