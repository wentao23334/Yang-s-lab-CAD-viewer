# React CAD Viewer

这是一个基于 React 和 Three.js 的交互式CAD装配网页查看器。它支持零件点选、材质修改、属性查看、多种显示模式等功能。

---

## 🚀 如何运行 (Quick Start)

请遵循以下步骤在您的本地计算机上运行此应用。

### 1. 先决条件

确保您的电脑上已经安装了 [Node.js](https://nodejs.org/) (推荐LTS版本)。

### 2. 安装依赖

在项目根目录打开终端，并运行以下命令来安装所有必需的库：

```bash
npm install
```

### 3. 启动开发服务器

安装完成后，运行以下命令来启动本地开发服务器：

```bash
npm run dev
```

### 4. 在浏览器中打开

服务器启动后，终端会显示一个本地网址，通常是：

`http://localhost:5173`

将此网址复制到您的浏览器（如Chrome, Edge, Firefox）中打开，即可看到并使用CAD查看器。

---

## ✨ 主要功能 (Features)

- **交互式3D视图**: 基于`@react-three/fiber`，提供流畅的轨道摄像机控制（旋转、平移、缩放）。
- **零件列表与搜索**: 在右侧面板显示模型的所有零件，并支持按名称快速搜索。
- **点选高亮**: 在3D视图或列表中点击零件，可实现双向高亮选中。
- **材质编辑器**: 可实时修改选中零件的颜色、金属度和粗糙度，并能一键恢复默认材质。
- **多种显示模式**:
  - **Normal**: 正常显示。
  - **Isolate**: 仅显示选中的零件。
  - **X-Ray**: 半透明化所有未选中的零件。
- **标签系统**: 可在三维场景中显示各零件的名称标签，并支持鼠标悬停显示。
- **模型专属材质配置**: 支持为特定模型加载预定义的材质配置文件，实现开箱即用的多材质显示。
- **性能优化**: 已集成Draco解码器，支持加载经Draco压缩处理的`.glb`模型，能显著提升加载速度。

---

## 🎨 材质自定义 (Material Customization)

本应用提供了灵活的材质自定义功能，您可以修改单个零件的材质，也可以设置所有零件的默认材质。

### 1. 编辑单个零件材质

1.  **选中零件**: 在3D视图中点击一个零件，或在右侧的“Parts”列表中选择它。
2.  **使用材质编辑器**: 在右侧面板的“Material Editor”部分，您可以使用以下控件修改选中零件的材质：
    *   **Material Presets (材质预设)**: 从下拉菜单中选择一个预设材质（如“不锈钢”、“绿色橡胶”等），即可快速应用一组预设的颜色、金属度和粗糙度。
    *   **Color (颜色)**: 使用颜色选择器调整零件的颜色。
    *   **Metalness (金属度)**: 使用滑块调整零件的金属度（0.0为非金属，1.0为全金属）。
    *   **Roughness (粗糙度)**: 使用滑块调整零件的粗糙度（0.0为光滑，1.0为粗糙）。
    *   **Opacity (透明度)**: 使用滑块调整零件的透明度（0.0为完全透明，1.0为完全不透明）。
3.  **恢复默认**: 点击“Restore Default”按钮，可以将当前零件的材质恢复到其初始加载时的状态。

### 2. 设置所有零件的默认材质

当模型首次加载时，所有零件都会被赋予一个默认材质。目前，这个默认材质被设置为 **PEEK**。

要修改所有零件的默认材质，您需要编辑 `src/components/Model.tsx` 文件：

1.  **打开 `src/components/Model.tsx` 文件**。
2.  找到 `useEffect` 钩子内部，有如下代码段：
    ```typescript
    const peekPreset = materialPresets.find(p => p.name === 'PEEK');
    const defaultMaterial = peekPreset ? new THREE.MeshStandardMaterial({
        color: new THREE.Color(peekPreset.color),
        metalness: peekPreset.metalness,
        roughness: peekPreset.roughness,
        opacity: peekPreset.opacity, // Added opacity
    }) : new THREE.MeshStandardMaterial({ color: 0xcccccc }); // Fallback if PEEK not found

    // ...
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // ...
        child.material = defaultMaterial.clone(); // 应用默认材质
        child.material.transparent = defaultMaterial.transparent; // Ensure transparency is set
      }
    });
    ```
3.  **修改 `peekPreset` 变量**：您可以将 `materialPresets.find(p => p.name === 'PEEK')` 中的 `'PEEK'` 替换为 `src/utils/materials.ts` 中定义的任何其他预设材质的 `name` (例如 `'Stainless Steel'`)。
    ```typescript
    const defaultMaterial = materialPresets.find(p => p.name === 'Stainless Steel'); // 将默认材质改为不锈钢
    ```
    或者，您也可以在这里直接定义一个新的材质参数，而不是使用预设。

### 3. 模型专属材质配置

本应用支持为特定的3D模型加载预定义的材质配置文件。这使得您可以为每个模型定制其零件的初始材质，而无需修改代码。

1.  **配置文件位置**: 材质配置文件存放在 `public/configs/` 目录下。
2.  **配置文件命名**: 配置文件应以模型文件名命名，例如，对于 `assembly.glb` 模型，对应的配置文件应为 `assembly.json`。
3.  **配置文件格式**: 配置文件是一个JSON文件，包含 `modelName` 和一个 `parts` 数组。`parts` 数组中的每个对象应包含零件的 `name` (与模型中的零件名称一致) 和要应用的 `material` 预设名称。
    ```json
    {
      "modelName": "assembly.glb",
      "parts": [
        { "name": "Part001", "material": "Stainless Steel" },
        { "name": "Part002", "material": "Green Rubber" },
        { "name": "Part003", "material": "Glass" }
      ]
    }
    ```
4.  **材质应用逻辑**:
    *   当模型加载时，应用会尝试加载对应的配置文件。
    *   如果配置文件存在，其中指定的材质将**覆盖**默认材质（例如 PEEK）。
    *   如果某个零件在配置文件中没有指定材质，它将保持默认材质（例如 PEEK）。
    *   如果配置文件不存在，所有零件都将显示为默认材质。

### 4. 管理材质预设

所有预设材质的定义（如“硅”、“不锈钢”等）都集中存放在 `src/utils/materials.ts` 文件中。

1.  **打开 `src/utils/materials.ts` 文件**。
2.  您可以在 `materialPresets` 数组中：
    *   **添加新的预设**: 按照现有格式添加新的 `{ name: '新材料名', color: '#HEX颜色', metalness: 0.0-1.0, roughness: 0.0-1.0, opacity: 0.0-1.0 }` 对象。
    *   **修改现有预设**: 更改任何现有预设的 `color`, `metalness`, `roughness`, 或 `opacity` 值。
    *   **删除预设**: 移除不再需要的预设对象。

---

## ➕ 添加新模型 (Adding New Models)

为了在查看器中添加新的3D模型，您需要遵循以下步骤：

1.  **放置 GLB 模型文件：**
    *   将您的 `.glb` 模型文件复制到 `public/models/` 目录下。

2.  **创建/更新对应的模型配置 JSON 文件：**
    *   在 `public/configs/` 目录下，创建一个与您的新 GLB 模型同名（但扩展名为 `.json`）的配置文件。
    *   例如，如果您的新模型是 `MyNewModel.glb`，则需要创建 `public/configs/MyNewModel.json`。
    *   此 JSON 文件应包含 `modelName` 和一个 `parts` 数组，用于定义模型中每个部件的材质。
    *   **示例 `MyNewModel.json` 内容：**
        ```json
        {
          "modelName": "MyNewModel.glb",
          "parts": [
            { "name": "PartA", "material": "Stainless Steel" },
            { "name": "PartB", "material": "PEEK" }
          ]
        }
        ```
        （请根据您的模型实际部件名称和所需材质进行修改。）

3.  **更新模型清单 JSON 文件：**
    *   编辑 `public/models/models.json` 文件。
    *   将新 `.glb` 模型的**文件名**（例如 `"MyNewModel.glb"`）添加到 JSON 数组中。
    *   **示例 `models.json` 更新：**
        ```json
        [
          "IR H-Cell.glb",
          "MEA-Raman Cell.glb",
          "MyNewModel.glb"
        ]
        ```

4.  **刷新应用程序：**
    *   完成上述步骤后，只需刷新您的浏览器页面。应用程序将自动从 `models.json` 中获取更新后的模型列表，并根据对应的 `.json` 配置文件加载和显示新模型。
    *   **注意：** 在此流程下，您无需重新运行 `npm run dev` 或 `npm run build`。

---

## 🛠️ 优化3D模型 (Optimizing 3D Models)

为了提升加载速度和减小文件体积，特别是对于包含大量几何细节的3D模型，推荐使用 `gltf-transform` 工具进行优化。

### 1. 安装 gltf-transform CLI

在终端中运行以下命令全局安装 `gltf-transform` 命令行工具：

```bash
npm install -g @gltf-transform/cli
```

### 2. 应用 Draco 压缩

Draco 压缩是一种高效的几何数据压缩技术，能显著减小 `.glb` 文件的体积，同时保持视觉质量。`gltf-transform` 在应用 Draco 压缩时，会很好地保留模型的名称、材质等元数据。

请对 `public/models/` 目录下的每个 `.glb` 模型文件运行以下命令：

```bash
gltf-transform draco public/models/IR-H-Cell.glb public/models/IR-H-Cell.glb
gltf-transform draco public/models/IR-Raman-Cell.glb public/models/IR-Raman-Cell.glb
gltf-transform draco public/models/MEA-Raman-Cell.glb public/models/MEA-Raman-Cell.glb
```

**重要提示：**

*   请确保在运行这些命令前，你已经将原始的 `.glb` 文件（未被其他工具破坏名称的版本）放回 `public/models/` 目录。
*   `gltf-transform` 会直接覆盖原始文件，请在操作前做好备份。

完成压缩后，你的模型文件体积将大大减小，有助于更快的加载和部署。

---

## 📁 项目结构

项目的主要源代码位于 `/src` 目录下：

- `src/app/`: React应用的根组件。
- `src/components/`: 可复用的React组件（如3D场景、UI面板、标签等）。
- `src/hooks/`: 存放自定义React Hooks，用于封装复杂逻辑（如显示模式逻辑）。
- `src/state/`: 使用 `Zustand` 进行全局状态管理。
- `src/utils/`: 存放工具函数（如计算包围盒、材质预设）。
- `public/`: 存放静态资源，如3D模型 (`.glb`) 和Draco解码器。

---

## 📦 构建生产版本

如果您需要将此应用部署到服务器，可以运行以下命令：

```bash
npm run build
```

此命令会在项目根目录生成一个 `dist` 文件夹，其中包含了所有优化和打包后的静态文件，可用于生产环境部署。
