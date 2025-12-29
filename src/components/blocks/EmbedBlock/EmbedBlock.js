import React, { useState } from "react";
import { Link, ExternalLink } from "lucide-react";
import "../Block.css";
import "./EmbedBlock.css";

/**
 * Embed Block - Embed external content (YouTube, etc.)
 */
export default function EmbedBlock({ data, onUpdate }) {
  const [url, setUrl] = useState(data?.url || "");
  const [embedType, setEmbedType] = useState(data?.embedType || "url");

  const getEmbedType = (url) => {
    if (!url) return "url";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
    if (url.includes("codepen.io")) return "codepen";
    return "url";
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const type = getEmbedType(newUrl);
    setEmbedType(type);
    onUpdate({ url: newUrl, embedType: type });
  };

  const renderEmbed = () => {
    if (!url) return null;

    switch (embedType) {
      case "youtube":
        const videoId = getYouTubeId(url);
        if (videoId) {
          return (
            <div className="embed-iframe-container">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video"
              />
            </div>
          );
        }
        break;
      case "vimeo":
        const vimeoId = url.match(/vimeo.com\/(\d+)/)?.[1];
        if (vimeoId) {
          return (
            <div className="embed-iframe-container">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vimeo video"
              />
            </div>
          );
        }
        break;
      default:
        return (
          <div className="embed-link-preview">
            <Link size={20} />
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
              <ExternalLink size={14} />
            </a>
          </div>
        );
    }

    return (
      <div className="embed-link-preview">
        <Link size={20} />
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
          <ExternalLink size={14} />
        </a>
      </div>
    );
  };

  return (
    <div className="block embed-block">
      <div className="embed-input">
        <input
          type="text"
          placeholder="Paste URL (YouTube, Vimeo, Twitter, etc.)..."
          value={url}
          onChange={handleUrlChange}
          className="embed-url-input"
        />
      </div>
      {url && <div className="embed-preview">{renderEmbed()}</div>}
    </div>
  );
}

