# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Selected visual direction

- The user selected Product Design ideation option 3 on 2026-08-21.
- Preserve the quiet black-box cinema/gallery direction: matte black surfaces, oversized Chinese typography, full-bleed cinematic imagery, near-invisible UI chrome, hairline dividers, and a single acid-lime playback accent.
- Keep the page image-led and restrained. Avoid template-like card grids, decorative gradients, glassmorphism, neon cyberpunk styling, and excessive rounded corners.
- The intended surface is desktop-first React + Vite with a maximum content width of 1700px.

- 图片分类与项目分类必须支持改名、添加、删除，并与前台及 COS 内容清单同步。删除分类需保留已有内容并迁移到用户选择的其他分类。图片资产缩略图必须无需点击即可显示。

- 用户确认精选项目草图：每个分类标题旁放“显示更多”，下方用真实作品封面单行横向展示，支持鼠标拖动、左右按钮及触屏滑动；显示更多查看当前分类全部作品，点击封面查看该作品。保留黑底电影画廊风格。

- 项目横向列表封面改为 9:16 竖屏卡片，图片使用 contain 完整显示，悬停不得放大裁切，继续保留单行滑动与显示更多。
