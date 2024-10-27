function submitForm(ev) {
  ev.preventDefault();
  const formData = new FormData(ev.target);

  nextSteps(
    formData.get("id"),
    formData.get("name"),
    formData.get("suit"),
    formData.get("high-contrast"),
    formData.getAll("cards")
  );
}

function nextSteps(id, name, suit, highContrast, cards) {
  const {
    element: downloadElement,
    textureHCName,
    textureName,
  } = fileGenerator(id, name, suit, highContrast, cards);

  const titleNode = document.createElement("h2");
  titleNode.textContent = "Next steps";
  titleNode.className = "text-base font-semibold leading-7 text-gray-900 mb-1";

  const downloadDiv = document.createElement("div");
  downloadDiv.className = "mb-5";
  downloadDiv.appendChild(downloadElement);

  const step1 = document.createElement("div");
  step1.className = "mb-5";

  const copyTextNode = document.createElement("div");
  copyTextNode.textContent = "Copy the downloaded file into the folder:";

  const copyFolderNode = document.createElement("pre");
  copyFolderNode.className = "m-1 p-1 bg-gray-300";
  copyFolderNode.textContent = `[balatro-path]/Mods/DeckSkinsPlus/skins`;

  step1.appendChild(copyTextNode);
  step1.appendChild(copyFolderNode);

  const step2 = document.createElement("div");
  step2.className = "mb-5";

  const textNode = document.createElement("div");
  textNode.textContent = "Name your texture file as:";

  const fileNameNode = document.createElement("pre");
  fileNameNode.className = "m-1 p-1 bg-gray-300";
  fileNameNode.textContent = textureName;

  step2.appendChild(textNode);
  step2.appendChild(fileNameNode);

  if (highContrast) {
    const textHCNode = document.createElement("div");
    textHCNode.textContent = "Name your high contrast texture file as:";
    const fileNameHCNode = document.createElement("pre");
    fileNameHCNode.className = "m-1 p-1 bg-gray-300";
    fileNameHCNode.textContent = textureHCName;

    step2.appendChild(textHCNode);
    step2.appendChild(fileNameHCNode);
  }

  const step3 = document.createElement("div");
  step3.className = "mb-5";

  const textNode2 = document.createElement("div");
  textNode2.textContent =
    "Remember to have a texture in assets/x1 and assets/x2, such as:";

  const filePath1xNode = document.createElement("pre");
  filePath1xNode.className = "m-1 p-1 bg-gray-300";
  filePath1xNode.textContent = `[balatro-path]/Mods/DeckSkinsPlus/assets/1x/${textureName}`;
  const filePath2xNode = document.createElement("pre");
  filePath2xNode.className = "m-1 p-1 bg-gray-300";
  filePath2xNode.textContent = `[balatro-path]/Mods/DeckSkinsPlus/assets/2x/${textureName}`;

  step3.appendChild(textNode2);
  step3.appendChild(filePath1xNode);
  step3.appendChild(filePath2xNode);

  if (highContrast) {
    const textNode3 = document.createElement("div");
    textNode3.textContent =
      "Since you selected High contrast, you also need the HC versions:";
    const filePath1xHCNode = document.createElement("pre");
    filePath1xHCNode.className = "m-1 p-1 bg-gray-300";
    filePath1xHCNode.textContent = `[balatro-path]/Mods/DeckSkinsPlus/assets/1x/${textureHCName}`;
    const filePath2xHCNode = document.createElement("pre");
    filePath2xHCNode.className = "m-1 p-1 bg-gray-300";
    filePath2xHCNode.textContent = `[balatro-path]/Mods/DeckSkinsPlus/assets/2x/${textureHCName}`;

    step3.appendChild(textNode3);
    step3.appendChild(filePath1xHCNode);
    step3.appendChild(filePath2xHCNode);
  }

  const divNode = document.createElement("div");
  divNode.appendChild(downloadDiv);
  divNode.appendChild(step1);
  divNode.appendChild(step2);
  divNode.appendChild(step3);

  const mainNode = document.querySelector("#next-steps");
  mainNode.textContent = "";
  mainNode.className = "p-5";
  mainNode.removeAttribute("hidden");
  mainNode.appendChild(titleNode);
  mainNode.appendChild(divNode);
}

function fileGenerator(id, name, suit, highContrast, cards) {
  let cardName = "";
  let cardsTable = "";
  if (cards?.length < 13) {
    cardName = `_${cards.join("").toUpperCase()}`;
    cardsTable = ` { ${cards.map((x) => `"${x}"`).join(", ")} } `;
  }
  let suitName = "";
  if (suit !== "all") {
    suitName = `_${suit}`;
  }
  const textureName = highContrast
    ? `${id}${cardName}${suitName}_NC.png`
    : `${id}${cardName}${suitName}.png`;
  const textureHCName = highContrast
    ? `${id}${cardName}${suitName}_HC.png`
    : null;
  const file = `
local skin = {
  name = "${name}",
  suit = "${suit}",
  texture = "${textureName}",
  highContrastTexture = ${textureHCName ? `"${textureHCName}"` : "nil"},
  cards = ${cardsTable ? cardsTable : "nil"}
}

return skin`;

  return {
    element: fileDownloader(file, `${id}.lua`),
    textureName,
    textureHCName,
  };
}

function fileDownloader(string, name) {
  const encoder = new TextEncoder();
  const u8 = encoder.encode(string);

  const blob = new Blob([u8.buffer], {
    type: "text/plain",
  });
  const blobUrl = URL.createObjectURL(blob);

  const downloadNode = document.createElement("a");
  downloadNode.href = blobUrl;
  downloadNode.download = name;
  downloadNode.className =
    "rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50";
  downloadNode.textContent = "Download the .lua file from here";

  return downloadNode;

  //   URL.revokeObjectURL(blob);
}

document.querySelector("#gen-form")?.addEventListener("submit", submitForm);
