import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useWeaponStore } from '@/store/weaponStore';

export function HomePage() {
  const { weapon, skin, wireframe, rotation } = useWeaponStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(rotation);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    currentModel: THREE.Object3D | null;
    animationId: number | null;
  } | null>(null);

  // keep rotationRef in sync with store
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const width = container?.clientWidth || window.innerWidth;
    const height = container?.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x242424);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(15, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Preserve texture colors

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI;

    // Lighting for MeshStandardMaterial
    const ambient = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 8, -10);
    scene.add(rimLight);

    return { scene, camera, renderer, controls, currentModel: null, animationId: null };
  }, []);

  // Load model
  const loadModel = useCallback(
    async (weapon: string, skin: string) => {
      if (!sceneRef.current) return;

      const { scene, currentModel } = sceneRef.current;

      // Remove old model
      if (currentModel) {
        scene.remove(currentModel);
        sceneRef.current.currentModel = null;
      }

      const weaponStr = weapon.replace(' ', '_').toLowerCase();
      const skinStr = skin.replace(' ', '_').toLowerCase();
      const modelPath = `/assets/skins/${weaponStr}/scene.gltf`;
      const texturePath = `/assets/skins/${weaponStr}/textures/${skinStr}.png`;

      try {
        const loader = new GLTFLoader();
        const textureLoader = new THREE.TextureLoader();

        // Load texture
        const customTexture = await new Promise<THREE.Texture>((resolve, reject) =>
          textureLoader.load(texturePath, resolve, undefined, reject)
        );
        customTexture.colorSpace = THREE.SRGBColorSpace;

        // Load model
        const gltf = await new Promise<any>((resolve, reject) =>
          loader.load(modelPath, resolve, undefined, reject)
        );

        const model = gltf.scene;

        // Normalize size & center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 10 / maxSize;

        model.scale.multiplyScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Apply material
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.material = new THREE.MeshStandardMaterial({
              map: customTexture,
              wireframe: wireframe,
            });
          }
        });

        // Put in a pivot group so it rotates around center
        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);

        sceneRef.current.currentModel = pivot;
        console.log(`Loaded ${weapon} with ${skin}`);
      } catch (err) {
        console.error(`Error loading model ${weapon} with ${skin}`, err);
      }
    },
    [wireframe]
  );

  // Animation
  const animate = useCallback(() => {
    if (!sceneRef.current) return;

    const { controls, renderer, scene, camera, currentModel } = sceneRef.current;

    if (currentModel && rotationRef.current) {
      currentModel.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);

    sceneRef.current.animationId = requestAnimationFrame(animate);
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    if (!sceneRef.current || !canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const { camera, renderer } = sceneRef.current;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }, []);

  // Init scene
  useEffect(() => {
    const sceneData = initScene();
    if (sceneData) {
      sceneRef.current = sceneData;
      animate();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        sceneRef.current.renderer.dispose();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initScene, animate, handleResize]);

  // Load new model on weapon/skin change
  useEffect(() => {
    if (weapon && skin && sceneRef.current) {
      loadModel(weapon, skin);
    }
  }, [weapon, skin, loadModel]);

  // Update wireframe toggle
  useEffect(() => {
    if (!sceneRef.current?.currentModel) return;
    sceneRef.current.currentModel.traverse((child: any) => {
      if (child.isMesh) {
        child.material.wireframe = wireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [wireframe]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
