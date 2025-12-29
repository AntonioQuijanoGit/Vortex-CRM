/**
 * Backlinks System - Track page references
 */

/**
 * Extract page references from content
 */
export function extractPageReferences(content, pages) {
  const references = [];
  const pageTitles = pages.map(p => p.title.toLowerCase());
  
  if (typeof content === 'string') {
    // Look for [[Page Title]] syntax
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    let match;
    while ((match = wikiLinkRegex.exec(content)) !== null) {
      const pageTitle = match[1].trim();
      const page = pages.find(p => p.title.toLowerCase() === pageTitle.toLowerCase());
      if (page) {
        references.push(page.id);
      }
    }
  } else if (Array.isArray(content)) {
    // Check blocks for references
    content.forEach(block => {
      if (block.data) {
        Object.values(block.data).forEach(value => {
          if (typeof value === 'string') {
            const refs = extractPageReferences(value, pages);
            references.push(...refs);
          }
        });
      }
    });
  }
  
  return [...new Set(references)]; // Remove duplicates
}

/**
 * Get backlinks for a page
 */
export function getBacklinks(pageId, allPages) {
  const backlinks = [];
  
  allPages.forEach(page => {
    if (page.id === pageId) return;
    
    const references = extractPageReferences(page.content, allPages);
    if (references.includes(pageId)) {
      backlinks.push({
        pageId: page.id,
        pageTitle: page.title,
      });
    }
  });
  
  return backlinks;
}

/**
 * Create a wiki link
 */
export function createWikiLink(pageTitle) {
  return `[[${pageTitle}]]`;
}

