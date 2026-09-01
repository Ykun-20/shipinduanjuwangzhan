import COS from "cos-js-sdk-v5";

export const COS_BUCKET = "yk-9527-1454067391";
export const COS_REGION = "ap-guangzhou";
export const COS_PUBLIC_BASE_URL = `https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com`;
export const CONTENT_MANIFEST_KEY = "site/liwanmin-portfolio.json";

const CONFIG_STORAGE_KEY = "liwanmin_cos_admin_config";

export function cosAsset(fileName) {
  return `${COS_PUBLIC_BASE_URL}/assets/${fileName}`;
}

export function localAsset(fileName) {
  return `${import.meta.env.BASE_URL}assets/${fileName}`;
}

export function cosUrl(key) {
  return `${COS_PUBLIC_BASE_URL}/${key}`;
}

export function loadCosConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || "null"); } catch { return null; }
}

function cleanCredential(value) {
  return String(value || "").replace(/[\s\u200B-\u200D\uFEFF]/g, "");
}

export function saveCosConfig(config) {
  const secretId = cleanCredential(config.secretId);
  const secretKey = cleanCredential(config.secretKey);
  if (!/^AKID[A-Za-z0-9]{20,}$/.test(secretId)) throw new Error("SecretId 格式无效：应以 AKID 开头。请从子账号的 API 密钥页面重新复制。");
  if (secretKey.length < 20) throw new Error("SecretKey 格式无效或内容不完整，请重新复制与该 SecretId 配套的密钥。");
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ secretId, secretKey }));
}

export function isCosConfigured() {
  const config = loadCosConfig();
  return Boolean(config?.secretId && config?.secretKey);
}

function createClient() {
  const config = loadCosConfig();
  if (!config?.secretId || !config?.secretKey) throw new Error("请先填写具有该存储桶写入权限的 COS 密钥。");
  return new COS({ SecretId: config.secretId, SecretKey: config.secretKey });
}

export function uploadToCos(file, key) {
  const cos = createClient();
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: COS_BUCKET,
      Region: COS_REGION,
      Key: key,
      Body: file,
      ACL: "public-read",
    }, (error) => {
      if (error) reject(new Error(error.message || "COS 上传失败"));
      else resolve(cosUrl(key));
    });
  });
}

export function uploadContentFile(file, folder) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "file";
  const key = `${folder}/${Date.now()}-${safeName}`;
  return uploadToCos(file, key);
}

export async function syncManifest(content) {
  const blob = new Blob([JSON.stringify({ ...content, updatedAt: new Date().toISOString() }, null, 2)], {
    type: "application/json",
  });
  return uploadToCos(blob, CONTENT_MANIFEST_KEY);
}

export async function loadManifest() {
  const response = await fetch(`${cosUrl(CONTENT_MANIFEST_KEY)}?v=${Date.now()}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`读取 COS 内容清单失败（HTTP ${response.status}）`);
  return response.json();
}

// COS 文件尚未上传或暂时不可用时，继续使用随网站构建发布的本地资源。
export function useLocalAssetFallback(event) {
  const fallbackUrl = event.currentTarget.dataset.fallbackSrc;
  if (!fallbackUrl || event.currentTarget.dataset.usingLocalFallback === "true") return;
  event.currentTarget.dataset.usingLocalFallback = "true";
  event.currentTarget.src = fallbackUrl;
}

