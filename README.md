# CS:GO Weapon Skin Viewer
Inspect3D is a web application for viewing **CS:GO weapon models with skin textures** in interactive 3D.

---

## Features

- **Weapon & Skin Selection**  
  Choose CS:GO weapons and their skins.

- **Interactive 3D Controls**  
  Rotate, zoom, and pan with OrbitControls.

- **Realistic Lighting Setup**  
  Ambient, key, fill, and rim lights for polished PBR (MeshStandardMaterial) rendering.

- **Wireframe Toggle**  
  Switch between solid and wireframe mode for a stylized view.

- **Auto Rotation**  
  Toggle automatic rotation and adjust its speed with a slider.

- **Responsive Layout**  
  Canvas resizes dynamically with the window.

---

## Screenshots
<img width="1919" height="872" alt="image" src="https://github.com/user-attachments/assets/d16f0dc8-8d6a-463d-a41b-3902e44954f7" />
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/c3c60862-5142-4959-bcdf-a31a4c106056" />
<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/0170bfce-9725-4149-a603-50c2895b345e" />


---

## Installation & Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/realBoltDev/inspect3d.git
   cd inspect3d
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

---

## Assets

- Models (`scene.gltf`) and textures (`.png`) should be placed under:

  ```
  /public/assets/skins/{weapon}/scene.gltf
  /public/assets/skins/{weapon}/textures/{skin}.png
  ```

- Example:
  ```
  /public/assets/skins/ak-47/scene.gltf
  /public/assets/skins/ak-47/textures/asiimov.png
  ```

---

## Controls

- **Sidebar UI**
  - Select Weapon → Updates available skins
  - Select Skin → Loads model with correct texture
  - Toggle Wireframe → Switch mesh rendering mode
  - Toggle Rotation → Enable/disable auto-rotation
  - Adjust Rotation Speed → Change spin rate

- **3D Canvas**
  - Left Mouse Drag → Orbit
  - Right Mouse Drag → Pan
  - Scroll → Zoom

---

## Tech Stack

- React + Vite + TypeScript
- Three.js + GLTFLoader
- Mantine Core
