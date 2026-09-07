const defaults = {
  gallery: [{ id: "characters", title: "人物资产图", label: "CHARACTER ASSETS" }, { id: "scenes", title: "场景资产图", label: "SCENE ASSETS" }],
  project: [{ id: "shortDrama", title: "短剧", label: "SHORT DRAMA" }, { id: "otherWorks", title: "其他板块", label: "OTHER WORKS" }],
};
export function getCategories(content, kind) {
  return content[`${kind}Categories`] ?? defaults[kind];
}
export function updateCategories(content, kind, categories, removedId, destination) {
  const field = kind === "gallery" ? "galleryAssets" : "projects";
  const fallback = defaults[kind][0].id;
  const items = content[field] || [];
  if (removedId && items.some((item) => (item.category || fallback) === removedId) && !categories.some((item) => item.id === destination)) {
    throw new Error("请先添加其他分类，并选择已有内容的迁移分类。");
  }
  return { ...content, [`${kind}Categories`]: categories, [field]: items.map((item) => removedId && (item.category || fallback) === removedId ? { ...item, category: destination } : item) };
}
