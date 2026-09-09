import { lazy, Suspense, useState } from "react";
import { GearSix, X } from "@phosphor-icons/react";
import config from "./adminPassword.json";

const Panel = lazy(() => import("./AdminPanel"));
export default function AdminGate(props) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function lock() { setUnlocked(false); setOpen(false); setPassword(""); setError(""); }
  async function unlock(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
      const salt = Uint8Array.from(config.salt.match(/../g), x => parseInt(x, 16));
      const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt, iterations: config.iterations, hash: "SHA-256"}, key, 256);
      const hash = Array.from(new Uint8Array(bits), x => x.toString(16).padStart(2, "0")).join("");
      if (hash === config.hash) { setUnlocked(true); setPassword(""); }
      else setError("密码不正确，请重试。");
    } catch { setError("无法验证密码，请使用 HTTPS 地址或更新浏览器。"); }
    finally { setBusy(false); }
  }
  if (unlocked) return <Suspense fallback={<p role="status">正在打开管理…</p>}><Panel {...props} onLock={lock}/></Suspense>;
  if (!open) return <button className="admin-entry" type="button" onClick={() => setOpen(true)} aria-label="打开内容管理"><GearSix size={20}/></button>;
  return <aside className="admin-drawer" aria-label="管理解锁"><header><strong>管理解锁</strong><button type="button" onClick={lock} aria-label="关闭管理登录"><X size={20}/></button></header><div className="admin-scroll"><form onSubmit={unlock}><label>管理密码<input type="password" autoFocus autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required/></label><button type="submit" disabled={busy}>{busy ? "正在验证…" : "解锁管理"}</button><p role="alert">{error}</p></form></div></aside>;
}
