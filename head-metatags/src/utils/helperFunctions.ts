import endecUtil from '@sitevision/api/server/EndecUtil';
import propertyUtil from '@sitevision/api/server/PropertyUtil';
import type { Node } from '@sitevision/api/types/javax/jcr/Node';

// Function to strip HTML tags
export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, '');
};

export const processPreamble = (
  orderArray: string[],
  currentPage: Node,
  maxPreambleLength: number,
  isOgMeta: boolean
): string | null =>  {
  let preambleText = '';

  if (orderArray.length !== 0) {
    for (const meta of orderArray) {
      if (!preambleText) {
        preambleText = propertyUtil.getString(currentPage, meta, '');
      }
    }

    preambleText = preambleText.trim();
    if (maxPreambleLength > 0 && preambleText.length > maxPreambleLength) {
      preambleText = preambleText.substring(0, maxPreambleLength) + '...';
    }

    if (preambleText) {
      preambleText = stripHtml(preambleText);
      preambleText = endecUtil.escapeXML(preambleText);

      return isOgMeta        ? `<meta property="og:description" content="${preambleText}" />`        : `<meta name="description" content="${preambleText}" />`;
    }
  }

  return null;
};