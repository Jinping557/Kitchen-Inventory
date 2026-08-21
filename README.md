# 🍳 我的厨房库存台 (Kitchen Inventory)

一款**纯前端、单文件**的厨房食材库存与菜谱管理 Web 应用，无需后端、无需安装依赖，打开即用，数据保存在浏览器本地 (localStorage)。

![GitHub Pages Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Single File](https://img.shields.io/badge/single--file-HTML-orange)

---

## ✨ 功能一览

### 🏠 首页概览
- **今日提醒**：红色（已过期）、橙色（7天内到期）分级提醒，一键处理
- **快速统计**：食材总数、即将过期、菜谱总数等数据一览
- **全局搜索**：一次搜索覆盖库存、待购、食谱、收藏链接
- **卡片可拖动排序**：首页模块自由排列，打造专属布局

### 📦 库存管理
- 记录食材**名称、分类、数量、单位、保质期、存放位置、备注**
- 支持**蔬菜 / 肉禽蛋 / 水产 / 豆制品 / 主食 / 调料佐料 / 零食 / 其他** 8 大分类
- 支持**冷藏 / 冷冻 / 常温**等存放位置，可自定义分类和存放位置
- 保质期可视化：红色=过期、橙色=即将到期
- 数量步进器：一键 ±1 快速调整库存
- 零食/即食标记：追剧零食一键标记

### 🛒 待购清单 (Shopping List)
- 从库存不足一键添加到购物车
- 从菜谱一键添加「缺的食材」到待购清单（批量多选）
- 支持数量、单位、优先级、备注单独编辑
- 勾选已购买，一键清理已完成项

### 🍜 菜品推荐 (Recipes)
- **内置 19 个家常菜谱**：番茄炒蛋、土豆炖牛肉、蛋炒饭、红烧排骨…
- **食材匹配度**：根据当前库存自动计算每个菜谱可做程度（进度条 + 百分比）
- 标签筛选：家常 / 快手 / 硬菜 / 汤品 / 主食 / 下饭
- 支持自定义菜谱：名称、标签、所需食材、步骤（可拖动排序）
- 点菜谱进入「制作模式」，分步骤引导烹饪，制作完成自动扣减对应食材

### 🔗 外部收藏
- 收藏抖音 / 小红书 / B站 / 下厨房等外部菜谱链接
- 支持标签、备注分组管理

### 💾 数据备份与恢复
- **导出全部备份**：一键下载 JSON，包含所有库存 / 待购 / 菜谱 / 收藏数据
- **导入整包恢复**：换设备或清缓存后无痛迁移
- 警告提示：数据仅存本机浏览器，定期备份防止丢失

---

## 🚀 快速开始

### 方式一：本地直接使用
因为是**纯 HTML 单文件**，直接双击打开即可：

```bash
# 克隆或下载仓库后
open kitchen_inventory.html          # macOS
start kitchen_inventory.html         # Windows
xdg-open kitchen_inventory.html      # Linux
```

### 方式二：本地起个静态服务器
```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve .

# 然后访问 http://localhost:8080/kitchen_inventory.html
```

---

## 🌐 部署到 GitHub Pages（已内置 Actions 自动部署）

仓库已配置 **GitHub Actions 工作流**，推送到 `main` 分支即自动部署。

### 部署步骤（一次性设置）

1. **推送仓库到 GitHub**（如果还没有）：
   ```bash
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

2. **开启 GitHub Pages**（仓库 Settings 里操作一次）：
   - 进入仓库 → **Settings** → 左侧 **Pages**
   - **Source** 选择 **GitHub Actions**（不是 Deploy from branch）
   - 保存

3. **触发部署**：
   - 推送代码到 `main` 分支会自动触发 `.github/workflows/deploy.yml`
   - 或手动触发：仓库 → **Actions** → 选「Deploy to GitHub Pages」→ **Run workflow**

4. **访问页面**：
   - 部署完成后，Pages 地址会出现在 Settings → Pages 或 Action 运行日志中
   - 格式通常为：`https://<你的用户名>.github.io/<仓库名>/`

> 💡 工作流会自动把 `kitchen_inventory.html` 拷贝为 `index.html`，因此无需手动改名，访问根路径即可直接打开。

---

## 📁 项目结构

```
.
├── kitchen_inventory.html      # 主应用（单文件，HTML + CSS + JS 全内置）
├── README.md                    # 本文档
├── LICENSE                      # MIT 许可证
└── .github/
    └── workflows/
        └── deploy.yml           # GitHub Pages 自动部署工作流
```

---

## 🛠 技术说明

| 特性 | 说明 |
|------|------|
| **架构** | 纯前端单文件 SPA，无任何依赖 |
| **存储** | 浏览器 `localStorage`，键名前缀 `kitchen_` |
| **样式** | 原生 CSS 变量 + 暖色调草本主题（香草绿/琥珀/番茄红） |
| **动画** | CSS `@keyframes` + `prefers-reduced-motion` 适配 |
| **响应式** | 移动端 / 平板 / 桌面端全覆盖，桌面端首页自动双栏网格 |
| **无障碍** | `:focus-visible` 键盘导航、语义化标签 |

### localStorage 数据结构
```javascript
kitchen_stock    // 库存数组
kitchen_shop     // 待购清单
kitchen_rec      // 自定义菜谱
kitchen_links    // 外部收藏链接
kitchen_cats     // 自定义分类
kitchen_locs     // 自定义存放位置
kitchen_dash     // 首页卡片排序
kitchen_meta     // 元信息（版本等）
```

---

## 📝 使用小贴士

1. **定期备份**：换手机/清浏览器缓存前一定要先「导出全部备份」！
2. **保质期自动提醒**：设置了保质期的食材会在首页自动按紧急程度分级冒泡
3. **菜谱匹配**：加库存时分类与名称尽量规范，匹配度算得更准
4. **拖动排序**：分类、存放位置、菜谱步骤、首页卡片都支持拖动重排
5. **移动端友好**：已适配 iPhone 安全区 (`env(safe-area-inset-bottom)`)，添加到主屏幕体验更佳

---

## 📄 License

MIT © 我的厨房库存台
