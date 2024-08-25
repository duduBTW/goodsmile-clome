function setupGlobalData() {
  // Step 1: Select the <script> element
  const scriptElement = document.querySelector("script#__DATA__");
  if (!scriptElement) {
    throw new Error("ids script not found");
  }

  // Step 2: Get the JSON string from the script content
  const jsonString = scriptElement.textContent;
  if (!jsonString) {
    throw new Error("ids script has no content");
  }

  window.home = JSON.parse(jsonString);
  window.search = JSON.parse(jsonString);
}

setupGlobalData();
