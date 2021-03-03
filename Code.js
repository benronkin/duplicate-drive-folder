function doGet(request) {
  return HtmlService.createTemplateFromFile('public/index').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 *
 * @param {*} param0
 */
// eslint-disable-next-line no-unused-vars
function copyFolders({ sourceId, destinationId, isCopyFiles }) {
  let sourceFolder;
  let destinationFolder;

  if (!sourceId) {
    throw Error(`Source folder ID wasn't provided`);
  }
  if (!destinationId) {
    throw Error(`Destination folder ID wasn't provided`);
  }

  try {
    sourceFolder = DriveApp.getFolderById(sourceId);
  } catch (e) {
    throw Error(`${sourceId} is not a valid folder ID`);
  }

  try {
    destinationFolder = DriveApp.getFolderById(destinationId);
  } catch (e) {
    throw Error(`${destinationId} is not a valid folder ID`);
  }

  copy_(sourceFolder, destinationFolder, isCopyFiles);

  function copy_(from, to, isCopyFiles) {
    if (isCopyFiles) {
      const files = from.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        file.makeCopy(file.getName(), to);
      }
    }

    const subfolders = from.getFolders();
    while (subfolders.hasNext()) {
      const subfolder = subfolders.next();
      const newTo = to.createFolder(subfolder.getName());
      copy_(subfolder, DriveApp.getFolderById(newTo.getId()), isCopyFiles);
    }
  } // end of copy_
}
