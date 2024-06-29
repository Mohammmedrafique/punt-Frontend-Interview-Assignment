import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

import fontData from "./punt-frontend-assignment.json";

const TextEditor = () => {
  const [text, setText] = useState("Hello World");
  const [fontFamily, setFontFamily] = useState("ABeeZee");
  const [fontWeight, setFontWeight] = useState("400");
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    // Load saved data from localStorage
    const savedText = localStorage.getItem("editorText");
    const savedFont = localStorage.getItem("editorFont");
    const savedWeight = localStorage.getItem("editorWeight");
    const savedItalic = localStorage.getItem("editorItalic");

    if (savedText) setText(savedText);
    if (savedFont) setFontFamily(savedFont);
    if (savedWeight) setFontWeight(savedWeight);
    if (savedItalic) setIsItalic(savedItalic === "true");

    // Load font
    loadFont(
      savedFont || fontFamily,
      savedWeight || fontWeight,
      savedItalic === "true"
    );
  }, []);

  useEffect(() => {
    // Auto-save
    localStorage.setItem("editorText", text);
    localStorage.setItem("editorFont", fontFamily);
    localStorage.setItem("editorWeight", fontWeight);
    localStorage.setItem("editorItalic", isItalic.toString());

    // Load font when font properties change
    loadFont(fontFamily, fontWeight, isItalic);
  }, [text, fontFamily, fontWeight, isItalic]);

  const loadFont = (family, weight, italic) => {
    const fontStyle = italic ? "italic" : "normal";
    const fontUrl = fontData[family][`${weight}${italic ? "italic" : ""}`];

    if (fontUrl) {
      const font = new FontFace(family, `url(${fontUrl})`, {
        weight,
        style: fontStyle,
      });
      font
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
        })
        .catch((error) => {
          console.error("Error loading font:", error);
        });
    }
  };

  const handleFontFamilyChange = (e) => {
    const newFont = e.target.value;
    const availableWeights = Object.keys(fontData[newFont]).filter(
      (key) => !key.includes("italic")
    );
    const newWeight = availableWeights.includes(fontWeight)
      ? fontWeight
      : availableWeights[0];
    const newItalic = fontData[newFont].hasOwnProperty(`${newWeight}italic`)
      ? isItalic
      : false;

    setFontFamily(newFont);
    setFontWeight(newWeight);
    setIsItalic(newItalic);
  };

  const handleFontWeightChange = (e) => {
    const newWeight = e.target.value;
    const newItalic = fontData[fontFamily].hasOwnProperty(`${newWeight}italic`)
      ? isItalic
      : false;
    setFontWeight(newWeight);
    setIsItalic(newItalic);
  };

  const handleReset = () => {
    setText("Hello World");
    setFontFamily("ABeeZee");
    setFontWeight("400");
    setIsItalic(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label
            htmlFor="fontFamily"
            className="block text-sm font-medium text-gray-700"
          >
            Font Family
          </label>
          <select
            id="fontFamily"
            value={fontFamily}
            onChange={handleFontFamilyChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            {Object.keys(fontData).map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="fontWeight"
            className="block text-sm font-medium text-gray-700"
          >
            Font Weight
          </label>
          <select
            id="fontWeight"
            value={fontWeight}
            onChange={handleFontWeightChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
          >
            {Object.keys(fontData[fontFamily])
              .filter((key) => !key.includes("italic"))
              .map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isItalic"
            checked={isItalic}
            onChange={(e) => setIsItalic(e.target.checked)}
            disabled={
              !fontData[fontFamily].hasOwnProperty(`${fontWeight}italic`)
            }
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <label htmlFor="isItalic" className="ml-2 text-sm text-gray-700">
            Italic
          </label>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        style={{
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontStyle: isItalic ? "italic" : "normal",
        }}
      />
      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
        >
          Reset
        </button>
        <button
          onClick={() => alert("Saved!")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
