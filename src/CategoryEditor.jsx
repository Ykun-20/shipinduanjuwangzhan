import { useState } from "react";

export default function CategoryEditor({ kind, title, categories, onSave }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [removing, setRemoving] = useState(null);
  async function submit(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = new FormData(form).get("title").trim();
    if (!name || categories.some((item) => item.id !== id && item.title === name)) return setMessage("分类名称不能为空或重复。");
    setBusy(true);
    const next = id ? categories.map((item) => item.id === id ? { ...item, title: name } : item) : [...categories, { id: crypto.randomUUID(), title: name, label: kind === "gallery" ? "IMAGE ASSETS" : "PROJECTS" }];
    if (await onSave(kind, next)) { setMessage(""); if (!id) form.reset(); }
    setBusy(false);
  }
  async function remove(event) {
    event.preventDefault();
    setBusy(true);
    const destination = new FormData(event.currentTarget).get("destination");
    if (await onSave(kind, categories.filter((item) => item.id !== removing), removing, destination)) setRemoving(null);
    setBusy(false);
  }
  return <section><h3>{title}</h3><fieldset disabled={busy} className="category-editor">
    {categories.map((item) => <form key={`${item.id}-${item.title}`} onSubmit={(event) => submit(event, item.id)}><input name="title" aria-label={`${item.title}分类名称`} defaultValue={item.title} required/><div className="admin-row-actions"><button type="submit">保存名称</button><button type="button" className="admin-delete" onClick={() => setRemoving(item.id)}>删除分类</button></div></form>)}
    <form onSubmit={(event) => submit(event)}><input name="title" aria-label={`${title}新分类名称`} placeholder="新分类名称" required/><button type="submit">添加分类</button></form>
    {removing && <form onSubmit={remove}><p>删除「{categories.find((item) => item.id === removing)?.title}」，已有内容将移入：</p><select name="destination" aria-label="迁移到分类">{categories.filter((item) => item.id !== removing).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><div className="admin-row-actions"><button type="submit">确认删除分类</button><button type="button" onClick={() => setRemoving(null)}>取消</button></div></form>}
    {message && <p role="alert">{message}</p>}
  </fieldset></section>;
}
