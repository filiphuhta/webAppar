import hooks from '@sitevision/api/server/hooks';
import portletContextUtil from '@sitevision/api/server/PortletContextUtil';
import propertyUtil from '@sitevision/api/server/PropertyUtil';
import endecUtil from '@sitevision/api/server/EndecUtil';
import appData from '@sitevision/api/server/appData';
import { processPreamble } from './utils/helperFunctions';

hooks.addHeadElement((req) => {
  const titleOrder = appData.get('title')    ? (appData.get('title') as string).split(',')    : [];
  const seoPreambleOrder = appData.get('seoDescription')    ? (appData.get('seoDescription') as string).split(',')    : [];
  const ogPreambleOrder = appData.get('ogDescription')    ? (appData.get('ogDescription') as string).split(',')    : [];
  const imageOrder = appData.get('image')    ? (appData.get('image') as string).split(',')    : [];

  const maxPreambleLength = 167;
  const imageFallbackNode = appData.getNode('fallbackImage');

  const currentPage = portletContextUtil.getCurrentPage();
  if (!currentPage) {
    return '';
  }

  let imageUrl = '';
  let titleText = '';
  let imageWidth = '';
  let imageHeight = '';
  let imageMimeType = '';

  // Result
  const result: string[] = [];

  // Render Image Meta
  if (imageOrder.length != 0) {
    for (const meta of imageOrder) {
      if (!imageUrl) {
        const imageNode = propertyUtil.getNode(currentPage, meta);
        if (imageNode) {
          imageWidth = propertyUtil.getInt(imageNode, 'width', 0).toString();
          imageHeight = propertyUtil.getInt(imageNode, 'height', 0).toString();
          imageMimeType = propertyUtil.getString(imageNode, 'mimeType', '');

          if (
            parseInt(imageWidth, 10) >= 200 &&            parseInt(imageHeight, 10) >= 200
          ) {
            imageUrl = propertyUtil.getString(imageNode, 'URL', '');
          }
        }
      }
    }

    if (!imageUrl && imageFallbackNode) {
      // Set fallback if no other image is found
      imageUrl = propertyUtil.getString(imageFallbackNode, 'URL'); 
      imageWidth = propertyUtil.getInt(imageFallbackNode, 'width', 0).toString();
      imageHeight = propertyUtil.getInt(imageFallbackNode, 'height', 0).toString();
      imageMimeType = propertyUtil.getString(imageFallbackNode, 'mimeType', '');
    }

    if (imageUrl) {
      result.push(
        `<meta property="og:image" content="${endecUtil.escapeXML(
          imageUrl
        )}" />`
      );
      result.push(
        `<meta name="og:image:width" content="${endecUtil.escapeXML(
          imageWidth
        )}" />`
      );
      result.push(
        `<meta name="og:image:height" content="${endecUtil.escapeXML(
          imageHeight
        )}" />`
      );
      result.push(
        `<meta name="og:image:type" content="${endecUtil.escapeXML(
          imageMimeType
        )}" />`
      );
    }
  }

  // Render Preamble Meta
  const ogMetaElement = processPreamble(
    ogPreambleOrder,
    currentPage,
    maxPreambleLength,
    true
  );

  if (ogMetaElement) {
    result.push(ogMetaElement);
  }

  // Render Preamble SEO Metadata
  const seoMetaElement = processPreamble(
    seoPreambleOrder,
    currentPage,
    maxPreambleLength,
    false
  );

  if (seoMetaElement) {
    result.push(seoMetaElement);
  }

  // Render OG Title Meta
  if (titleOrder.length != 0) {
    for (const meta of titleOrder) {
      if (!titleText) {
        titleText = propertyUtil.getString(currentPage, meta, '');
      }
    }

    titleText = titleText.trim();
    if (titleText) {
      result.push(
        `<meta property="og:title" content="${endecUtil.escapeXML(
          titleText
        )}" />`
      );
    }
  }

  // Default Twitter card and OG URL
  result.push('<meta name="twitter:card" content="summary" />');
  result.push(
    `<meta property="og:url" content="${endecUtil.escapeXML(
      propertyUtil.getString(currentPage, 'URL')
    )}" />`
  );
  result.push(' <meta property="og:type" content="website">');

  return result.join('\n');
});
