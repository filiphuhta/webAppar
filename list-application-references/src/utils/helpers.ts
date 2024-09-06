import nodeIteratorUtil from "@sitevision/api/server/NodeIteratorUtil";
import propertyUtil from "@sitevision/api/server/PropertyUtil";
import type { Node } from "@sitevision/api/types/javax/jcr/Node";
import logUtil from "@sitevision/api/server/LogUtil";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import appData from "@sitevision/api/server/appData";

function getPages(page: Node, html?: string) {
  let contentHtml = html ? html : "";
  try {
    const type = propertyUtil.getString(page, "jcr:primaryType");
    if (type == "sv:page") {
      const searchComponents = getSearchComponents(page);
      if (searchComponents != null && searchComponents.length > 0) {
        const displayName = propertyUtil.getString(page, "displayName");
        const href = propertyUtil.getString(page, "URI");
        contentHtml += "<li>";
        contentHtml +=
          '<a href="' + href + '">' + displayName + " (" + href + ")</a>";
        contentHtml += "<ul>";
        searchComponents.forEach((component) => {
          contentHtml += "<li>";
          contentHtml += component;
          contentHtml += "</li>";
        });
        contentHtml += "</ul>";
        contentHtml += "</li>";
      }
    }
    const subPages = nodeIteratorUtil.getMenuItemsIncludingFolders(page);
    if (subPages.hasNext()) {
      while (subPages.hasNext()) {
        const subPage = subPages.next() as Node;
        contentHtml += getPages(subPage, html);
      }
    }
  } catch (error) {
    logUtil.error("An error occurred when trying to get pages");
  }
  return contentHtml;
}
function getSearchComponents(page: Node) {
  const pageid = propertyUtil.getString(page, "jcr:uuid");
  const pageContentId = pageid + "_pageContent";
  const pageContent = resourceLocatorUtil.getNodeByIdentifier(pageContentId);

  if (pageContent == null) {
    return null;
  }

  const contentAreas = pageContent.getNodes();
  while (contentAreas.hasNext()) {
    const contentArea = contentAreas.next() as Node;

    const mainContentAreas = contentArea.getNodes();
    if (mainContentAreas.hasNext()) {
      const components = [];
      while (mainContentAreas.hasNext()) {
        const area = mainContentAreas.next() as Node;
        const portletName = propertyUtil.getString(area, "portletName");
        if (portletName != null) {
          const found = portletName == appData.get("appId");
          if (found) {
            components.push(propertyUtil.getString(area, "displayName"));
          }
        }
      }
      if (components.length > 0) {
        return components;
      }
    }
  }
  return null;
}

export { getPages };
