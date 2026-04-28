// グローバル変数
let scene, camera, renderer, controls;
let bottleMesh;
let bottleMeshes = [];
let labelTexture = null;
let originalBottleTexture = null;
let isLoaded = false;
let uploadedOverlayImage = null;
let textureUpdateVersion = 0;
let environmentReady = false;

// UV展開図のオーバーレイ領域（px）
const OVERLAY_REGION = { x: 169, y: 466, width: 661, height: 502 };

// マウスコントロール用変数
let mouseX = 0,
  mouseY = 0;
let targetRotationX = 0,
  targetRotationY = 0;
let rotationX = 0,
  rotationY = 0;

// テクスチャ品質を向上させるヘルパー関数
function improveTextureQuality(texture) {
  if (!texture) return;

  const maxAnisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 16;
  texture.anisotropy = maxAnisotropy;

  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  if ("colorSpace" in texture && THREE.SRGBColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
  } else if ("encoding" in texture && THREE.sRGBEncoding) {
    texture.encoding = THREE.sRGBEncoding;
  }

  texture.needsUpdate = true;
}

// 統一されたマテリアル設定を適用する関数
function applyMaterialSettings(material) {
  if (!material) return;

  if ("envMapIntensity" in material) {
    material.envMapIntensity = 1.2;
  }

  material.needsUpdate = true;
}

function forceGunmetal(material) {
  if (!material) return;

  material.color.setRGB(0.18, 0.18, 0.18);
  material.metalness = 1.0;
  material.roughness = 0.15;

  material.metalnessMap = null;
  material.roughnessMap = null;

  material.needsUpdate = true;
}

function loadHDREnvironment() {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new THREE.RGBELoader().load(
    "/bottle-maker/assets/models/studio_small_09_4k.hdr",
    (hdrTexture) => {
      const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

      scene.environment = envMap;
      scene.background = new THREE.Color(0xf0f0f0);
      environmentReady = true;

      hdrTexture.dispose();
      pmremGenerator.dispose();

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    },
    undefined,
    (err) => {
      console.error("HDR読み込みエラー:", err);
      environmentReady = false;
      pmremGenerator.dispose();
    }
  );
}

// 初期化実行（動的スクリプト挿入時はDOMが既にロード済みのため直接呼び出し）
(function () {
  if (typeof THREE === "undefined") {
    console.error("Three.jsが読み込まれていません");
    showErrorMessage("Three.jsが読み込まれていません。ページを再読み込みしてください。");
    return;
  }
  console.log("Three.js読み込み確認完了");
  initializeApp();
})();

// 初期化関数
function initializeApp() {
  try {
    setupThreeJS();
    setupEventListeners();
    setupRadioActiveState();
    createBottle();
    animate();
  } catch (error) {
    console.error("initializeApp エラー:", error);
    showErrorMessage("初期化中にエラーが発生しました: " + error.message);
  }
}

// ラジオ項目のis-active切り替え
function setupRadioActiveState() {
  const radioItems = document.querySelectorAll(".control__radio-item");
  if (!radioItems || radioItems.length === 0) return;

  function applyActiveStateByChecked() {
    radioItems.forEach((item) => {
      const input = item.querySelector('input[type="radio"]');
      if (input && input.checked) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });
  }

  const radios = document.querySelectorAll('.control__radio-item input[type="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", applyActiveStateByChecked);
  });

  applyActiveStateByChecked();
}

// Three.jsのセットアップ
function setupThreeJS() {
  console.log("setupThreeJS 開始");
  const canvas = document.getElementById("bottleCanvas");
  const container = document.getElementById("bottleContainer");

  console.log("Canvas要素:", canvas);
  console.log("Container要素:", container);

  if (!canvas) {
    throw new Error("Canvas要素が見つかりません");
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const initW = container ? container.clientWidth : canvas.clientWidth;
  const initH = container ? container.clientHeight : canvas.clientHeight;

  camera = new THREE.PerspectiveCamera(75, initW / initH, 0.1, 1000);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(initW, initH, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if ("outputEncoding" in renderer && THREE.sRGBEncoding) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  setupLighting();
  loadHDREnvironment();
  setupSimpleMouseControls();

  window.addEventListener("resize", onWindowResize);

  function setupSimpleMouseControls() {
    const canvas = document.getElementById("bottleCanvas");
    let isMouseDown = false;

    canvas.addEventListener("mousedown", (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    canvas.addEventListener("mousemove", (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    canvas.addEventListener("mouseup", () => {
      isMouseDown = false;
    });

    canvas.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = event.deltaY * 0.01;
      camera.position.z += delta;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    });

    let isTouchRotating = false;
    let touchStartX = 0;
    let touchStartY = 0;

    let isPinching = false;
    let pinchStartDistance = 0;
    let pinchStartCameraZ = 0;

    function distanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    }

    canvas.addEventListener(
      "touchstart",
      (event) => {
        if (!event.touches) return;
        if (event.touches.length === 1) {
          isTouchRotating = true;
          isPinching = false;
          touchStartX = event.touches[0].clientX;
          touchStartY = event.touches[0].clientY;
        } else if (event.touches.length >= 2) {
          isTouchRotating = false;
          isPinching = true;
          pinchStartDistance = distanceBetweenTouches(event.touches);
          pinchStartCameraZ = camera.position.z;
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      (event) => {
        if (!event.touches) return;
        event.preventDefault();

        if (isTouchRotating && event.touches.length === 1) {
          const tx = event.touches[0].clientX;
          const ty = event.touches[0].clientY;
          const deltaX = tx - touchStartX;
          const deltaY = ty - touchStartY;
          targetRotationY += deltaX * 0.01;
          targetRotationX += deltaY * 0.01;
          touchStartX = tx;
          touchStartY = ty;
        } else if (isPinching && event.touches.length >= 2) {
          const currentDistance = distanceBetweenTouches(event.touches);
          const scale = currentDistance / (pinchStartDistance || currentDistance);
          const desiredZ = pinchStartCameraZ / (scale || 1);
          camera.position.z = Math.max(2, Math.min(10, desiredZ));
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchend",
      (event) => {
        if (event.touches.length === 0) {
          isTouchRotating = false;
          isPinching = false;
        } else if (event.touches.length === 1) {
          isPinching = false;
          isTouchRotating = true;
          touchStartX = event.touches[0].clientX;
          touchStartY = event.touches[0].clientY;
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchcancel",
      () => {
        isTouchRotating = false;
        isPinching = false;
      },
      { passive: false }
    );
  }

  function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-10, -10, -5);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
  }
}

// GLBファイル読み込み
function createBottle() {
  console.log("createBottle(GLB/keep-camera) 開始");

  const loader = new THREE.GLTFLoader();
  const MODEL_URL = "/bottle-maker/assets/models/bottle_3.19-2.glb";

  loader.load(
    MODEL_URL,
    (gltf) => {
      const root = gltf.scene || gltf.scenes[0];
      if (!root) {
        showErrorMessage("GLBのsceneが見つかりません");
        return;
      }

      root.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          if (!o.name) o.name = o.uuid.slice(0, 8);

          if (Array.isArray(o.material)) {
            o.material = o.material.map((m) => (m ? m.clone() : m));
          } else if (o.material) {
            o.material = o.material.clone();
          }

          if (o.material) {
            const materials = Array.isArray(o.material) ? o.material : [o.material];
            materials.forEach((m) => {
              if (!m) return;
              const textures = [m.map, m.normalMap, m.roughnessMap, m.metalnessMap, m.aoMap, m.emissiveMap];
              textures.forEach((tex) => {
                if (tex) improveTextureQuality(tex);
              });
              applyMaterialSettings(m);
            });
          }

          console.log("mesh:", o.name, o.material);
        }
      });

      const bottleGroup = new THREE.Group();
      bottleGroup.name = "bottleGroup";
      bottleGroup.add(root);
      scene.add(bottleGroup);
      window.bottleGroup = bottleGroup;

      normalizeAndCenterModel(root, { targetHeight: 6 });

      bottleMeshes = pickBottlePartsFromScene(root);
      bottleMesh = bottleMeshes[0] || null;

      if (!bottleMeshes.length) {
        showErrorMessage("ボトルメッシュが見つかりません");
        return;
      }

      if (bottleMesh) {
        bottleMesh.geometry.computeVertexNormals();

        const material = Array.isArray(bottleMesh.material) ? bottleMesh.material[0] : bottleMesh.material;
        if (material && material.map) {
          originalBottleTexture = material.map.clone();
          improveTextureQuality(originalBottleTexture);
        }
      }

      isLoaded = true;
      hideLoading();

      updateBottleTextureFromSelections(true);
    },
    undefined,
    (err) => {
      console.error("GLB読み込みエラー:", err);
      showErrorMessage("GLBの読み込みに失敗しました。コンソールを確認してください。");
    }
  );
}

// モデルを原点センタリング＆高さ規格化
function normalizeAndCenterModel(object3D, { targetHeight } = {}) {
  const box = new THREE.Box3().setFromObject(object3D);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  if (size.y > 0) {
    const s = targetHeight / size.y;
    object3D.scale.setScalar(s);

    const box2 = new THREE.Box3().setFromObject(object3D);
    const center2 = box2.getCenter(new THREE.Vector3());
    object3D.position.sub(center2);
  } else {
    object3D.position.sub(center);
  }
}

// ボトルメッシュを取得する関数
function pickBottlePartsFromScene(root) {
  const meshes = [];

  root.traverse((o) => {
    if (o.isMesh) {
      meshes.push(o);
    }
  });

  return meshes;
}

// ファイルアップロード、リセット、保存ボタンのイベントリスナーを設定
function setupEventListeners() {
  const fileInput = document.getElementById("labelUpload");
  console.log("[setupEventListeners] fileInput:", fileInput);
  if (fileInput) {
    fileInput.addEventListener("change", handleFileUpload);
  }

  const capRadios = document.querySelectorAll('input[name="cap-color"]');
  const labelRadios = document.querySelectorAll('input[name="label-color"]');
  capRadios.forEach((r) => r.addEventListener("change", () => updateBottleTextureFromSelections(false)));
  labelRadios.forEach((r) => r.addEventListener("change", () => updateBottleTextureFromSelections(false)));

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetDesign);
  }

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveImage);
  }

  function handleFileUpload(event) {
    console.log("[handleFileUpload] change event:", event);
    const file = event.target.files[0];
    console.log("[handleFileUpload] selected file:", file);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("画像ファイルを選択してください。", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      console.log("[handleFileUpload] FileReader onload, result length:", e.target.result && e.target.result.length);
      const img = new Image();
      img.onload = function () {
        console.log("[handleFileUpload] 画像読み込み完了:", img.width, "x", img.height);

        uploadedOverlayImage = img;
        console.log("[handleFileUpload] uploadedOverlayImage set. call updateBottleTextureFromSelections()");
        updateBottleTextureFromSelections(false);

        showUploadPreview(img);
        showMessage("画像がボトルに適用されました。", "success");
      };
      img.onerror = function () {
        console.error("画像の読み込みに失敗しました");
        showMessage("画像の読み込みに失敗しました。", "error");
      };
      img.src = e.target.result;
    };
    reader.onerror = function () {
      console.error("ファイルの読み込みに失敗しました");
      showMessage("ファイルの読み込みに失敗しました。", "error");
    };
    reader.readAsDataURL(file);
  }

  function resetDesign() {
    const ok = window.confirm("初期状態にリセットします。よろしいですか？");
    if (!ok) return;

    const fileInput = document.getElementById("labelUpload");
    if (fileInput) {
      fileInput.value = "";
    }

    const previewEl = document.getElementById("uploadPreview");
    if (previewEl) {
      previewEl.innerHTML = "";
      previewEl.className = "upload-preview empty";
    }

    uploadedOverlayImage = null;
    labelTexture = null;

    const capGold = document.getElementById("cap-gold");
    const labelBlack = document.getElementById("label-black");

    if (capGold) capGold.checked = true;
    if (labelBlack) labelBlack.checked = true;

    syncRadioActiveState();
    updateBottleTextureFromSelections(true);

    showMessage("デザインがリセットされました。", "success");
  }

  function saveImage() {
    if (!isLoaded) {
      showMessage("ボトルの読み込みが完了していません。", "error");
      return;
    }

    const originalSize = renderer.getSize(new THREE.Vector2());
    const scale = 2;
    renderer.setSize(originalSize.x * scale, originalSize.y * scale);

    renderer.render(scene, camera);

    const link = document.createElement("a");
    link.download = "champagne_bottle_design.png";
    link.href = renderer.domElement.toDataURL("image/png");
    link.click();

    renderer.setSize(originalSize.x, originalSize.y);
    onWindowResize();

    showMessage("完成イメージが保存されました。", "success");
  }
}

function syncRadioActiveState() {
  const radioItems = document.querySelectorAll(".control__radio-item");
  if (!radioItems || radioItems.length === 0) return;

  radioItems.forEach((item) => {
    const input = item.querySelector('input[type="radio"]');
    if (input && input.checked) {
      item.classList.add("is-active");
    } else {
      item.classList.remove("is-active");
    }
  });
}

// 現在のラジオ選択からテクスチャ適用
// forceDefaultOnEmpty = true の場合、未選択時はデフォルト画像を適用
async function updateBottleTextureFromSelections(forceDefaultOnEmpty = false) {
  const currentVersion = ++textureUpdateVersion;

  const cap = getSelectedValue("cap-color");
  const label = getSelectedValue("label-color");

  console.log("[updateBottleTextureFromSelections]", {
    cap,
    label,
    forceDefaultOnEmpty,
    uploadedOverlayImage,
    currentVersion,
  });

  const bothSelected = Boolean(cap && label);

  try {
    let baseImg = null;

    if (!bothSelected) {
      if (!forceDefaultOnEmpty) {
        console.log("[updateBottleTextureFromSelections] bothSelected is false and no forceDefault");
        return;
      }
      baseImg = await loadImage("/bottle-maker/assets/textures/default.png");
    } else {
      baseImg = await loadBaseTemplateImage(cap, label);
    }

    if (currentVersion !== textureUpdateVersion) {
      console.log("[updateBottleTextureFromSelections] stale after base load:", currentVersion);
      return;
    }

    const composedTexture = await composeCanvasTexture(baseImg, uploadedOverlayImage);

    if (currentVersion !== textureUpdateVersion) {
      console.log("[updateBottleTextureFromSelections] stale after compose:", currentVersion);
      disposeTextureSafely(composedTexture);
      return;
    }

    applyTextureToBottle(composedTexture);

    if (uploadedOverlayImage) {
      showUploadPreview(uploadedOverlayImage);
    } else {
      showUploadPreview(baseImg);
    }

    console.log("[updateBottleTextureFromSelections] applyTextureToBottle called");
  } catch (err) {
    console.error("テクスチャ合成に失敗:", err);

    if (currentVersion !== textureUpdateVersion) return;

    showMessage("テクスチャの読み込みに失敗しました。", "error");
  }
}

// nameで指定したラジオの選択値を返す（なければ空文字）
function getSelectedValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "";
}

// cap, label の value からテクスチャファイルパスを作成
function buildBaseTexturePath(capValue, labelValue) {
  const cap = capValue.replace(/^cap-/, "");
  const label = labelValue.replace(/^label-/, "");
  const path = `/bottle-maker/assets/textures/${cap}-${label}.png`;
  console.log("[buildBaseTexturePath] capValue:", capValue, "labelValue:", labelValue, "→", path);
  return path;
}

// ベースのUV展開図画像を読み込む
function loadBaseTemplateImage(capValue, labelValue) {
  const path = buildBaseTexturePath(capValue, labelValue);
  return loadImage(path).catch((err) => {
    console.warn("指定のベーステクスチャが見つかりません。フォールバックします:", path, err);
    return loadImage("/bottle-maker/assets/textures/gold-black.png");
  });
}

// 汎用画像ローダ（Image要素を返す）
function loadImage(src) {
  console.log("[loadImage] start load:", src);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log("[loadImage] loaded:", src, img.width, "x", img.height);
      resolve(img);
    };
    img.onerror = (e) => {
      console.error("[loadImage] error:", src, e);
      reject(e);
    };
    img.src = src;
  });
}

// ベース画像とオーバーレイ画像からCanvasベースのThree.Textureを生成
async function composeCanvasTexture(baseImg, overlayImg) {
  const canvas = document.createElement("canvas");
  canvas.width = baseImg.naturalWidth || baseImg.width;
  canvas.height = baseImg.naturalHeight || baseImg.height;
  const ctx = canvas.getContext("2d");

  console.log("[composeCanvasTexture] canvas size:", canvas.width, "x", canvas.height, "overlayImg:", overlayImg);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

  if (overlayImg) {
    console.log("[composeCanvasTexture] draw overlay start");
    const region = OVERLAY_REGION;

    ctx.save();
    ctx.beginPath();
    ctx.rect(region.x, region.y, region.width, region.height);
    ctx.clip();

    const overlayWidth = overlayImg.naturalWidth || overlayImg.width;
    const overlayHeight = overlayImg.naturalHeight || overlayImg.height;

    const scale = region.height / overlayHeight;
    const drawHeight = region.height;
    const drawWidth = overlayWidth * scale;
    const drawX = region.x + (region.width - drawWidth) / 2;
    const drawY = region.y;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(overlayImg, drawX, drawY, drawWidth, drawHeight);
    console.log("[composeCanvasTexture] overlay drawn at:", { drawX, drawY, drawWidth, drawHeight });
    ctx.restore();
  }

  const texture = new THREE.Texture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;
  improveTextureQuality(texture);
  texture.needsUpdate = true;

  console.log("[composeCanvasTexture] texture ready");
  return texture;
}

// ボトルへテクスチャを適用（GLB 内の全メッシュに同じ展開図テクスチャを割り当て）
function applyTextureToBottle(texture) {
  if (!bottleMeshes.length) {
    console.error("ボトルメッシュが見つかりません");
    return;
  }

  const disposedMaps = new Set();

  bottleMeshes.forEach((mesh) => {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material) => {
      if (!material) return;

      const prevMap = material.map;
      if (prevMap && prevMap !== texture && !disposedMaps.has(prevMap)) {
        disposedMaps.add(prevMap);
        disposeTextureSafely(prevMap);
      }

      material.map = texture;
      applyMaterialSettings(material);
      material.needsUpdate = true;
    });

    mesh.visible = true;
  });

  labelTexture = texture;
}

function disposeTextureSafely(texture) {
  if (!texture) return;
  if (originalBottleTexture && texture === originalBottleTexture) return;
  try {
    texture.dispose();
  } catch (e) {
    console.warn("texture dispose failed:", e);
  }
}

// アップロード画像のプレビュー表示
function showUploadPreview(img) {
  const preview = document.getElementById("uploadPreview");
  if (!preview) return;

  preview.innerHTML = "";

  const previewImg = document.createElement("img");
  previewImg.src = img.src;
  previewImg.alt = "preview";

  preview.appendChild(previewImg);
  preview.className = "upload-preview";
}

// エラーメッセージをshowMessageに指定する関数
function showErrorMessage(message) {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.innerHTML = `<span style="color: #e53e3e;">${message}</span>`;
  }

  showMessage(message, "error");
}

// メッセージを表示する関数
function showMessage(message, type) {
  const existingMessages = document.querySelectorAll(".success, .error");
  existingMessages.forEach((el) => el.remove());

  const messageDiv = document.createElement("div");
  messageDiv.className = type;
  messageDiv.textContent = message;

  const controlsSection = document.querySelector(".controls-section");
  if (controlsSection) {
    controlsSection.appendChild(messageDiv);
  }

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 3000);
}

// ローディングの非表示関数
function hideLoading() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "none";
  }
}

// カメラのアスペクト比、レンダラーのサイズを決定
function onWindowResize() {
  const container = document.getElementById("bottleContainer");
  if (!container || !camera || !renderer) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

// アニメーション
function animate() {
  requestAnimationFrame(animate);

  rotationX += (targetRotationX - rotationX) * 0.1;
  rotationY += (targetRotationY - rotationY) * 0.1;

  if (window.bottleGroup) {
    window.bottleGroup.rotation.x = rotationX;
    window.bottleGroup.rotation.y = rotationY;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// デフォルト画像を読み込んで適用する関数
function loadDefaultImage() {
  updateBottleTextureFromSelections(true);
}

/* --------------------------------------------------------------------- 
Web制作観点から必要な処理（のちに切り分け）
-----------------------------------------------------------------------*/

if (100000000 < window.innerWidth) {
  setupSwiperNoSwiping();
  window.mySwiper = new Swiper(".swiper", {
    loop: true,
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    pagination: {
      el: ".swiper-pagination",
    },
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    slidesPerView: 1.2,
  });
}

// スライドを操作中のUI要素で無効化
function setupSwiperNoSwiping() {
  const targets = document.querySelectorAll(".control__btn-box, .control__radio-item");
  if (!targets || targets.length === 0) return;

  targets.forEach((el) => el.classList.add("swiper-no-swiping"));

  const disableSwipe = () => {
    if (window.mySwiper) {
      window.mySwiper.allowTouchMove = false;
    }
  };
  const enableSwipe = () => {
    if (window.mySwiper) {
      window.mySwiper.allowTouchMove = true;
    }
  };

  targets.forEach((el) => {
    el.addEventListener("pointerdown", disableSwipe);
    el.addEventListener("pointerup", enableSwipe);
    el.addEventListener("pointercancel", enableSwipe);
    el.addEventListener("mouseleave", enableSwipe);
    el.addEventListener("touchstart", disableSwipe, { passive: true });
    el.addEventListener("touchend", enableSwipe);
    el.addEventListener("touchcancel", enableSwipe);
    el.addEventListener("mousedown", disableSwipe);
    el.addEventListener("mouseup", enableSwipe);
  });
}