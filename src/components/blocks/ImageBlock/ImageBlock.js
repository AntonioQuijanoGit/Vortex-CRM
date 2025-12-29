import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import "../Block.css";
import "./ImageBlock.css";

/**
 * Image Block - Upload and display images
 */
export default function ImageBlock({ data, onUpdate }) {
  const [imageUrl, setImageUrl] = useState(data?.url || data?.src || "");
  const [caption, setCaption] = useState(data?.caption || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result;
      setImageUrl(url);
      onUpdate({ url, src: url, caption });
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Error reading file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      onUpdate({ url, src: url, caption });
    }
  };

  const handleCaptionChange = (e) => {
    const newCaption = e.target.value;
    setCaption(newCaption);
    onUpdate({ url: imageUrl, src: imageUrl, caption: newCaption });
  };

  const handleRemove = () => {
    setImageUrl("");
    setCaption("");
    onUpdate({ url: "", src: "", caption: "" });
  };

  if (!imageUrl) {
    return (
      <div className="block image-block image-block-empty">
        <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={48} />
          <p>Click to upload an image or paste a URL</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
        <div className="image-url-input">
          <input
            type="text"
            placeholder="Or paste image URL here..."
            value={imageUrl}
            onChange={handleUrlChange}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              if (pasted.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
                setImageUrl(pasted);
                onUpdate({ url: pasted, src: pasted, caption });
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="block image-block">
      <div className="image-container">
        <img src={imageUrl} alt={caption || "Image"} />
        <button className="image-remove-btn" onClick={handleRemove} aria-label="Remove image">
          <X size={16} />
        </button>
      </div>
      {caption !== undefined && (
        <input
          className="image-caption"
          type="text"
          placeholder="Add a caption..."
          value={caption}
          onChange={handleCaptionChange}
        />
      )}
    </div>
  );
}

