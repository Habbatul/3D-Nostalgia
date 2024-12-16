import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { CSS3DRenderer } from "three/examples/jsm/Addons.js";

//ambil komponen canvas dari html
const canvas = document.getElementById("webgl");

// ========================= Inisiasi threeJS ====================
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.antialias = true;


//============================ Audio untuk web ==================================
const music = new Audio("audio/liminal-horror.mp3");
music.loop = true;
music.volume = 0.5;

canvas.addEventListener('click', () => {
  if (music.paused) {
    music.play();
  }
})

//================== Loader untuk jpeg jadi hdri juga ada cube untuk scene awal ==================
let cube;
let rt;

const loaderx = new THREE.TextureLoader();
loaderx.load("hdri/background-liminal-hqhan.webp", function (texture) {
  //buat texture agar ditampilkan sesuai aslinya
  texture.encoding = THREE.sRGBEncoding; 
  texture.colorSpace = THREE.SRGBColorSpace; 
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  //konversi tekstur menjadi cube render target
  rt = new THREE.WebGLCubeRenderTarget(2048); //texture.image.height
  rt.fromEquirectangularTexture(renderer, texture);

  scene.background = rt.texture;
  scene.environment = rt.texture;
  scene.environmentRotation = new THREE.Euler(0,0,0);
  scene.backgroundRotation = new THREE.Euler(0,0,0);
});


//make a cube, uji coba pkek scene environtment aja
const geometryCube = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0,
  envMap: rt ? rt.texture : null,
  metalness: 1,
});

cube = new THREE.Mesh(geometryCube, material);
scene.add(cube);



//========================= Disini adalah bagian GLTF Loader ======================
const loader = new GLTFLoader();
var model;

loader.load("gltf/computerCustom.glb", function (gltf) {
  model = gltf.scene;
  model.position.set(400, -9, 4); 
  model.scale.set(10, 10, 10); 
  model.name = "Cube013"; 

  //hilangkan frustumCulled agar selalu dirender tanpa menunggu muncul pada jarak pandang
  model.traverse((object) => {
    if (object.isMesh) {
      object.frustumCulled = false;
      object.material.envMap = rt ? rt.texture : null, 
      object.material.metalness = 0.4;
      object.material.roughness = 0.1;
    }
  });

  scene.add(model); 

},
  undefined,
  function (error) {
    console.error(error);
  }
);


// ============================ set awal posisi dan rotasi kamera ===============
camera.position.set(0, 0, 30);
camera.rotation.set(0, 0, 0);


//========================= Disini adalah bagian CSS2DRenderer ======================
//buat container untuk renderer CSS2D
var cssContainer = document.createElement("div");
cssContainer.style.position = "fixed";
cssContainer.style.top = 0;
cssContainer.style.pointerEvents = "none"; //memastikan bahwa elemen ini tidak menghalangi interaksi dengan elemen di bawahnya (ini nanti diubah2)
document.body.appendChild(cssContainer);

//buat renderer CSS2D di dalam container
var cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssContainer.appendChild(cssRenderer.domElement);

var text5 = document.createElement("div");
text5.innerHTML = `
  <div id="typedText">This app is half-finished because the developer is tired. Want to go to a nostalgic place? </div>
  <div id="buttonContainer" style="display:flex;justify-content:center;margin-top: 20px;">
      <button id="button1" class="saira-condensed-light" style="margin-right:0.3rem;cursor:pointer;">Let's go there</button><button id="button2" class="saira-condensed-light" style="margin-left:0.3rem;cursor:pointer;">I just want to be here</button>
  </div>
`;
text5.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text5.style.maxWidth = "400px"; //batas lebar maksimum
text5.style.height = "auto"; //inggi otomatis
text5.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text5.style.textAlign = "justify";
text5.style.padding = "1rem";
text5.style.lineHeight = "1.5";
text5.style.transition = "opacity 0.3s ease-in-out"; //animasi opacity transisi
text5.style.opacity = "0"; //set opacity awal menjadi 0
var label5 = new CSS2DObject(text5);
label5.position.set(0, 0, 5);

//label1
var textContent = `Hello, I am Habbatul Qolbi H the creator of this game. Welcome to this very empty place.`;
var text = document.createElement("div");
text.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red;margin-top:20px;text-align:center;">Click to continue...</div>
`;
text.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text.style.maxWidth = "400px"; //batas lebar maksimum
text.style.height = "auto"; //tinggi otomatis
text.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text.style.textAlign = "justify";
text.style.padding = "1rem";
text.style.lineHeight = "1.5";
text.style.transition = "opacity 0.3s ease-in-out"; //animasi opacity
text.style.opacity = "0"; //set opacity awal menjadi 0
var label = new CSS2DObject(text);
label.position.set(0, 0, 5);
scene.add(label);


var textContent2 = `Do you often feel lonely, even when surrounded by family and friends?`;
var text2 = document.createElement("div");
text2.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;">Click to continue...</div>
`;
text2.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text2.style.maxWidth = "400px"; //batas lebar maksimum
text2.style.height = "auto"; //inggi otomatis
text2.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text2.style.textAlign = "justify";
text2.style.padding = "1rem";
text2.style.lineHeight = "1.5";
text2.style.transition = "opacity 0.3s ease-in-out"; //animasi opacity transisi
text2.style.opacity = "0"; //set opacity awal menjadi 0
var label2 = new CSS2DObject(text2);
label2.position.set(0, 0, 5);


var textContent3 = `Sometimes, the presence of people around us is not enough to fill the emptiness inside.`;
var text3 = document.createElement("div");
text3.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;">Click to continue...</div>
`;
text3.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text3.style.maxWidth = "400px"; //batas lebar maksimum
text3.style.height = "auto"; //inggi otomatis
text3.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text3.style.textAlign = "justify";
text3.style.padding = "1rem";
text3.style.lineHeight = "1.5";
text3.style.transition = "opacity 0.3s ease-in-out"; //animasi opacity transisi
text3.style.opacity = "0"; //set opacity awal menjadi 0
var label3 = new CSS2DObject(text3);
label3.position.set(0, 0, 5);


var textContent4 = `Let's take a little nostalgia to the old devices that have been abandoned. We will explore about the good times together.`;
var text4 = document.createElement("div");
text4.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;margin-bottom:10px;">Wait for the exit button..</div>
  <div id="buttonContainer" class="hidden" style="justify-content:center;margin-top: 20px;">
      <button id="button1" class="saira-condensed-light" style="margin-right:0.3rem;cursor:pointer;">Let's go there</button><button id="button2" class="saira-condensed-light" style="margin-left:0.3rem;cursor:pointer;">I just want to be here</button>
  </div>
`;
text4.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text4.style.maxWidth = "400px"; //batas lebar maksimum
text4.style.height = "auto"; //inggi otomatis
text4.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text4.style.textAlign = "justify";
text4.style.padding = "1rem";
text4.style.lineHeight = "1.5";
text4.style.transition = "opacity 0.3s ease-in-out"; //animasi opacity transisi
text4.style.opacity = "0"; //set opacity awal menjadi 0
var label4 = new CSS2DObject(text4);
label4.position.set(0, 0, 5);


//-========================== handle animasi ketik ===========================
//kondisional, digunakan untuk mencegah kodingan dalam eventhandler label bekerja ketika animasi berjalan
var isTyping = true;

//inisialisasi soundeffect
const typingSound = new Audio("audio/label-typing.mp3");
typingSound.loop = true;
typingSound.volume = 0.1;

//animasi type writer untuk label yang pada css2drenderer
function typeWriter(textElement, text, speed, clickHereElement) {
  return new Promise((resolve) => {
    let i = 0;
    let lastTime = 0;
    function type(timestamp) {
      if (timestamp - lastTime > speed) {
        textElement.textContent += text.charAt(i);
        i++;
        lastTime = timestamp;

        //play audio
        typingSound.play();
        if (i < text.length) {
          requestAnimationFrame(type);
        } else {
          typingSound.pause();
          isTyping = false;
          console.log(isTyping);
          resolve();
          clickHereElement.style.color = "blue";
        }
      } else {
        requestAnimationFrame(type);
      }
    }
    type(0);
  });
}

//animasi ketik untuk menampilkan teks
async function animateText(textElement, textContent, speed, clickHereElement) {
  //hapus teks sebelum memulai animasi ketik
  textElement.textContent = "";
  await typeWriter(textElement, textContent, speed, clickHereElement);
}

//Funsgi ketika opacity mencapai 1, jalankan animasi mengetik
function opacityTransitionEndHandler(labelElement, textContent, speed) {
  //kondisi typing true sebelum ke animasi typing (agar tidak terjadi glitch animasi)
  isTyping = true;
  console.log(isTyping);
  var typedTextElement = labelElement.querySelector("#typedText");
  var clickHereElement = labelElement.querySelector("#clickHere");
  clickHereElement.style.color = "red";
  if (labelElement.style.opacity === "1") {
    animateText(typedTextElement, textContent, speed, clickHereElement);
  } else if (labelElement.style.opacity === "0") {
    typedTextElement.textContent = ""; //kosongkan teks saat opacity kembali menjadi 0
  }
}
//event listener untuk label2
label2.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    opacityTransitionEndHandler(label2.element, textContent2, 10);
  }
});

//event listener untuk label
label.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    opacityTransitionEndHandler(label.element, textContent, 10);
  }
});

//event listener untuk label
label3.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    opacityTransitionEndHandler(label3.element, textContent3, 10);
  }
});

//khusus untuk label 4 karena ada event untuk button (ketika opacity mencapai 1, jalankan animasi mengetik)
function opacityTransitionEndHandlerForLabel4(labelElement, textContent, speed, buttonContainer) {
  //Kondisi typing true sebelum ke animasi typing (agar tidak terjadi glitch animasi)
  isTyping = true;
  console.log(isTyping);
  var typedTextElement = labelElement.querySelector("#typedText");
  var clickHereElement = labelElement.querySelector("#clickHere");
  clickHereElement.style.color = "red";
  if (labelElement.style.opacity === "1") {
    //jalankan animasi typing
    typeWriter(typedTextElement, textContent, speed, clickHereElement).then(() => {
      //Animasi selesai, hilangkan kelas hidden dari button1 dan button2
      buttonContainer.classList.remove("hidden");
      buttonContainer.classList.add("flex");
      clickHereElement.classList.add("hidden");
    });
  } else if (labelElement.style.opacity === "0") {
    typedTextElement.textContent = ""; //Kosongkan teks saat opacity kembali menjadi 0
  }
}
//event listener untuk label
label4.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    let buttonContainer =
      label4.element.querySelector("#buttonContainer");
    buttonContainer.classList.remove("flex");
    buttonContainer.classList.add("hidden");
    label4.element.querySelector("#clickHere").classList.remove("hidden");
    opacityTransitionEndHandlerForLabel4(
      label4.element,
      textContent4,
      10,
      buttonContainer
    );
  }
});


//================= Hanlder animasi menuju komputer dari button label 4/label 5 =================
var started = false;
var kameraMenunjuMonitor = false;
label4.element.querySelector("#button1").addEventListener("click", function (event) {
  label4.element.style.opacity = "0";
  label4.element.addEventListener("transitionend", function (event) {
    scene.remove(label4);
    console.log("tutup step kembali ke step 0");
    gotoStep = 0;
    //kondisi step sudah sampai akhir
    gotoDone = true;
    cssContainer.style.pointerEvents = "none";
    scene.add(label5);

    //setelah step selesai atur kursor agar tidak hover otomatis di sumbu (0,0)
    mouse.set(-2, -2);
  });
  gotoComputerPosition();
});

label5.element.querySelector("#button1").addEventListener("click", function (event) {
  //Behavior sama pada step 4 untuk urutan label
  label5.element.style.opacity = "0";
  console.log("tutup step kembali ke step 0");
  gotoStep = 0;
  cssContainer.style.pointerEvents = "none";

  //setelah step selesai atur kursor agar tidak hover otomatis di sumbu (0,0)
  mouse.set(-2, -2);
  gotoComputerPosition();
});

function gotoComputerPosition() {

  //tammbahan rotate background
  new TWEEN.Tween(scene.backgroundRotation)
      .to({y:1.6}, 1500).start();

  //jarak camera pada saat tampilan komputer
  rotateCameraDistance = 30;

  //matikan objective diatas cube (tulisan h1)
  objectiveVisible = false;

  kameraMenunjuMonitor = false;
  started = false;

  var pivot = new THREE.Vector3(400, 0, -8); //biar lebih pas tadinya itu 400, -9, 4 sesuai posisi model tapi ini lebih pas untuk dijadikan pivot karena kan monitor punya tinggi
  var initialPosition = new THREE.Vector3(400, 20, 80);
  var distance = initialPosition.distanceTo(pivot);
  var angleValue = 1.5;

  new TWEEN.Tween(camera.position)
    .to(
      {
        x: pivot.x + distance * Math.cos(angleValue),
        y: initialPosition.y,
        z: pivot.z + distance * Math.sin(angleValue),
      },
      1500
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(() => {
      var startRotation = new THREE.Euler().copy(camera.rotation);

      camera.lookAt(pivot);
      var endRotation = new THREE.Euler().copy(camera.rotation);

      camera.rotation.copy(startRotation);

      new TWEEN.Tween(camera.rotation)
        .to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
          // console.log(camera.rotation);
        })
        .onComplete(() => {
          //buat cube hidden
          cube.visible = false;

          new TWEEN.Tween({ angle: angleValue })
            .to({ angle: Math.PI * 2.5 }, 1600)
            .onUpdate((obj) => {
              var angle = obj.angle;
              var newX = pivot.x + distance * Math.cos(angle);
              var newZ = pivot.z + distance * Math.sin(angle);
              camera.position.set(newX, initialPosition.y, newZ);
              camera.lookAt(pivot);
              // console.log(camera.rotation);
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
              new TWEEN.Tween(camera.position)
                // .to({ x: 400, y: 20, z: 40 }, 700)
                .to({ x: 400, y: 8, z: 25 }, 700)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                  camera.lookAt(pivot);
                })
                .onComplete(() => {
                  mouse.set(0, 0);
                  kameraMenunjuMonitor = true;
                  
                  //set frustumCulled jadi true lagi
                  if (model) {
                    model.traverse((object) => {
                      if (object.isMesh) {
                        console.log(object.frustumCulled)
                        object.frustumCulled = true
                        console.log(object.frustumCulled)
                      }
                    });
                  }

                })
                .start();
            })
            .start();
        })
        .start();
    })
    .start();
}

//Buat secondary scene, camera, dan render target
const renderTarget = new THREE.WebGLRenderTarget(512, 512); //Ubah ukuran render target menjadi 512x512
const secondaryCamera = new THREE.PerspectiveCamera(
  75,
  renderTarget.width / renderTarget.height,
  0.1,
  1000
);

const secondaryScene = new THREE.Scene();

//Ini untuk frame bentuk windows xp dan paint
var textureLoader = new THREE.TextureLoader();
var textureXp = textureLoader.load('texture/paint-xp.png');
var materialjpeg = new THREE.MeshBasicMaterial({
  map: textureXp,
  transparent: true
});
var geometryXp = new THREE.PlaneGeometry(5, 4);
var PlaneFrame = new THREE.Mesh(geometryXp, materialjpeg);
secondaryCamera.add(PlaneFrame);
secondaryScene.add(secondaryCamera);
PlaneFrame.scale.set(3.02, 3.8)
PlaneFrame.position.set(0, -0.1, -10);



//Muat HDR sebagai env map
new RGBELoader()
  .setDataType(THREE.FloatType)
  .load("hdri/terrain.hdr", function (hdrCubeMap) {
    hdrCubeMap.encoding = THREE.LinearEncoding;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envMap = pmremGenerator.fromEquirectangular(hdrCubeMap).texture;
    envMap.format = THREE.RGBAFormat;
    secondaryScene.environment = envMap; //Gunakan gambar HDRI sebagai env map

    //Hapus HDR equirectangular setelah selesai menggunakan pmremGenerator
    hdrCubeMap.dispose();
    //Gunakan gambar HDRI sebagai background
    secondaryScene.background = envMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    secondaryScene.add(ambientLight);
  });


//================ Penerapan shader untuk layar crt + vignette pada plane ======================
const crtTVShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;

    void main() {
    vec2 uv = vUv;

    //Efek vignette
    float radius = 0.85;
    float softness = 0.4;
    vec2 center = vec2(0.5, 0.5);
    float vignette = smoothstep(radius, radius - softness, length(uv - center));

    //Efek garis lurus
    vec2 p = mod(uv * vec2(100.0, 60.0), vec2(1.0));
    vec3 col = texture2D(tDiffuse, uv).rgb;
    col *= 0.9 + 0.1 * sin(30.0 * p.x * sin(time) + 30.0 * p.y * cos(time));
    col *= 0.95 + 0.05 * sin(32.0 * p.x * sin(time) + 32.0 * p.y * cos(time));
    
    //Gabungkan efek vignette dan garis lurus
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
    }
    `,
};

//Material dengan shader CRT TV
var materialMonitor = new THREE.ShaderMaterial({
  uniforms: THREE.UniformsUtils.clone(crtTVShader.uniforms),
  vertexShader: crtTVShader.vertexShader,
  fragmentShader: crtTVShader.fragmentShader,
});

//Set texture sebagai input untuk shader
materialMonitor.uniforms.tDiffuse.value = renderTarget.texture;

//Mesh untuk renderTarget
var geometry = new THREE.PlaneGeometry(5, 4);
var mesh = new THREE.Mesh(geometry, materialMonitor);
mesh.position.set(400, 3.4, -4.56);
mesh.scale.set(3.5, 3, 1);
mesh.rotation.set(-0.139, 0, 0);
scene.add(mesh);

//Buat orbit control untuk render target (secondary camera)
const controls = new OrbitControls(secondaryCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, -25);
controls.minDistance = 24;
controls.maxDistance = 120;


//============================== gltf loader untuk rendertarget
loader.load(
  "gltf/SeabedLamp3D.glb",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, -8, -25);
    model.scale.set(30, 30, 30);
    model.name = "uhuy";
    secondaryScene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);


//================ Disini adalah bagian event Handler untuk label teksbox ================
//definisikan object raycaster dan mouse untuk interaksi mouse dengan scene
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-2, -2);

//deteksi mouse agar bisa realtime
function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove, false);

//deteksi rouchscreen agar bisa realitme
function onTouchMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y =
    -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
}

window.addEventListener("touchmove", onTouchMove, false);


//================== animasi untuk rotasi terabatas mengikuti kursor mouse/touch =================
var rotateCameraDistance = 30;
var isWebMode = false;
//saat tekan tombol menuju monitor
function rotateCamera() {
  if (kameraMenunjuMonitor) {
    if(isWebMode){
      var pivot = new THREE.Vector3(400, -5, 4);
      var pivot2 = new THREE.Vector3(400, 4, -8);
      var pivot3 = new THREE.Vector3(400, 4, 0);
    }else{
      var pivot = new THREE.Vector3(400, -9, 4);
      var pivot2 = new THREE.Vector3(400, 0, -8);
      var pivot3 = new THREE.Vector3(400, 0, 0);
    }

    var distance = rotateCameraDistance;

    //Membatasi rotasi
    var angleX = 1.5 + Math.min(Math.max(mouse.x, -0.5), 0.5) * (Math.PI / 4);
    var angleY = Math.min(Math.max(-mouse.y + 1, 0.5), 10) * (Math.PI / 4);

    var newX = pivot.x + distance * Math.cos(angleX);
    var newY = pivot.y + distance * Math.sin(angleY);
    var newZ = pivot3.z + distance * Math.sin(angleX);

    //Tween animasi rotasi kamera
    new TWEEN.Tween(camera.position)
      .to({ x: newX, y: newY, z: newZ }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
    camera.lookAt(pivot2);
  }
}



//================================Disini untuk textbox pembuka ========================
//kondisional untuk textbox
var gotoStep = 0;
var gotoDone = false;

//step 1
label.element.addEventListener("click", function (event) {
  //jika animasi typing tidak berjalan
  if (!isTyping) {
    label.element.style.opacity = "0";
    scene.add(label2);
    gotoStep = 2;
    //ini dijalankan ketika label ada bukan ketika gotoStep=1
    label.element.addEventListener("transitionend", function (event) {
      if (gotoStep == 2) {
        console.log("step dua dijalankan");
        scene.remove(label);

        //gunakan disini karena pasti tidak bisa dihindarkan dari hover jadi nantinya animasi akan tetap berjalan
        label2.element.style.opacity = "1";
      }
    });
  }
});

//step 1
label.element.addEventListener("mouseover", function (event) {
  label.element.style.cursor = "pointer";
});

//step 2
label2.element.addEventListener("click", function (event) {
  //jika animasi typing tidak berjalan
  if (!isTyping) {
    label2.element.style.opacity = "0";
    scene.add(label3);
    gotoStep = 3;
    //ini dijalankan ketika label ada bukan ketika gotoStep=1
    label2.element.addEventListener("transitionend", function (event) {
      if (gotoStep == 3) {
        console.log("step tiga dijalankan");
        scene.remove(label2);

        //gunakan disini karena pasti tidak bisa dihindarkan dari hover jadi nantinya animasi akan tetap berjalan
        label3.element.style.opacity = "1";
      }
    });
  }
});

//step 2
label2.element.addEventListener("mouseover", function (event) {
  label2.element.style.cursor = "pointer";
});

//step 3
label3.element.addEventListener("click", function (event) {
  //jika animasi typing tidak berjalan
  if (!isTyping) {
    label3.element.style.opacity = "0";
    scene.add(label4);
    gotoStep = 4;
    //ini dijalankan ketika label ada bukan ketika gotoStep=1
    label3.element.addEventListener("transitionend", function (event) {
      if (gotoStep == 4) {
        console.log("step empat dijalankan");
        scene.remove(label3);

        //gunakan disini karena pasti tidak bisa dihindarkan dari hover jadi nantinya animasi akan tetap berjalan
        label4.element.style.opacity = "1";
      }
    });
  }
});

//step 3
label3.element.addEventListener("mouseover", function (event) {
  label3.element.style.cursor = "pointer";
});

//step 4
label4.element
  .querySelector("#button2")
  .addEventListener("click", function (event) {
    //jika animasi typing tidak berjalan
    if (!isTyping) {
      gotoStep = 3;
      label4.element.style.opacity = "0";
      label4.element.addEventListener("transitionend", function (event) {
        if (gotoStep == 3) {
          scene.remove(label4);
          console.log("tutup step kembali ke step 0");
          gotoStep = 0;
          //kondisi step sudah sampai akhir
          gotoDone = true;
          cssContainer.style.pointerEvents = "none";
          scene.add(label5);

          //setelah step selesai atur kursor agar tidak hover otomatis di sumbu (0,0)
          mouse.set(-2, -2);

          //hidupkan objective diatas cube (tulisan h1)
          objectiveVisible = true;
        }
      });
    }
  });

//step selesai (done) untuk label done
label5.element
  .querySelector("#button2")
  .addEventListener("click", function (event) {
    label5.element.style.opacity = "0";
    console.log("tutup step kembali ke step 0");
    gotoStep = 0;
    cssContainer.style.pointerEvents = "none";

    //setelah step selesai atur kursor agar tidak hover otomatis di sumbu (0,0)
    mouse.set(-2, -2);

    //hidupkan objective diatas cube (tulisan h1)
    objectiveVisible = true;
  });

//step 0
//tambahkan event listener untuk mousedown pada saat kursor berada pada kubus
function onMouseDownOnBox(event) {
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects([cube], true);

  if (intersects.length > 0) {
    //matikan objective diatas cube (tulisan h1)
    objectiveVisible = false;
    if (!gotoDone && gotoStep === 0) {
      cube.material.color.set(0xff0000);
      gotoStep = 1;
      label.element.style.opacity = "1";
      label.element.addEventListener("transitionend", function (event) {
        console.log("step pertama dijalankan");
        cssContainer.style.pointerEvents = "auto";
      });
    } else if (gotoDone && gotoStep === 0) {
      //menuju ke step done
      cube.material.color.set(0xff0000);
      gotoStep = 5;
      label5.element.style.opacity = "1";
      cssContainer.style.pointerEvents = "auto";
    }
  }
}
document.addEventListener("click", onMouseDownOnBox, false);

//tambahkan event listener ketika kursor mouse bergerak dan berada pada kubus
//ini dijalankan difungsi animate (agar realtime)
function onMouseMoveOnBox() {
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects([cube], true);

  //memperhatikan kondisi jumlah pesan
  if (intersects.length > 0) {
    if (gotoStep == 0) {
      canvas.style.cursor = "pointer";
      cube.material.color.set(0xff0000);
    } else {
      cssContainer.style.pointerEvents = "auto";

      //kondisional agar box tetap merah saat box ada
      if (gotoStep === 0) cube.material.color.set(0x00ff00);
    }
  } else {
    canvas.style.cursor = "auto";

    //kondisional agar box tetap merah saat box ada
    if (gotoStep === 0) cube.material.color.set(0x00ff00);
  }
}


//=================== animasi gerakan pada render target (secondary camera) ======================
var pivot1 = new THREE.Vector3(0, -8, -25);
var initialPosition1 = new THREE.Vector3().copy(secondaryCamera.position);
var distance1 = initialPosition1.distanceTo(pivot1);
var InitialAngle1 = 0;
var tween;
var rotate1;

var isMouseDown = false;
var isZooming = false;

function initialAnimation(distanceFromPivot, currentAngle) {
  tween = new TWEEN.Tween(secondaryCamera.position)
    .to({ x: pivot1.x + distanceFromPivot * Math.cos(currentAngle), y: initialPosition1.y, z: pivot1.z + distanceFromPivot * Math.sin(currentAngle) }, 500)
    .onComplete(() => {
      rotate1 = new TWEEN.Tween({ angle: currentAngle })
        .to({ angle: currentAngle + Math.PI * 2 }, 4000)
        .onUpdate((obj) => {
          var angle = obj.angle;
          var newX = pivot1.x + distanceFromPivot * Math.cos(angle);
          var newZ = pivot1.z + distanceFromPivot * Math.sin(angle);
          secondaryCamera.position.set(newX, initialPosition1.y, newZ);
          secondaryCamera.lookAt(pivot1);
        })
        .repeat(Infinity)
        .start();
    })
    .start();
}

initialAnimation(distance1, InitialAngle1);

//mendapatkan angle saat ini
function getCurrentAngle(objectPosition, pivotPosition) {
  return Math.atan2(objectPosition.z - pivotPosition.z, objectPosition.x - pivotPosition.x);
}

//Memulai Tween jika tidak sedang menahan tombol mouse
function startTween(distance, currentAngle) {
  if (!isMouseDown && !isZooming) {
    initialAnimation(distance, currentAngle);
  }
}

//Menghentikan Tween saat menahan tombol mouse
function stopTween() {
  if (isMouseDown || isZooming) {
    tween.stop();
    if (rotate1) rotate1.stop(); //Menghentikan tween rotate jika ada
  }
}

function onMouseDown(event) {
  isMouseDown = true;
  stopTween();
}

function onMouseUp(event) {
  isMouseDown = false;
  startTween(new THREE.Vector3().copy(secondaryCamera.position).distanceTo(pivot1), getCurrentAngle(new THREE.Vector3().copy(secondaryCamera.position), pivot1));
}

//Event listener untuk mouse move, mouse down, dan mouse up
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

//Event listener untuk touch start
document.addEventListener("touchstart", function (event) {
  if (!isZooming) {
    if (event.touches.length > 2) {
      onMouseDown(event.touches[0]);
    }
  }
}, false);

//Event listener untuk touch end
document.addEventListener("touchend", function (event) {
  if (!isZooming) {
    if (event.changedTouches.length > 2) {
      onMouseUp(event.changedTouches[0]);
    }
  }
}, false);

//Event listener untuk menghentikan animasi saat zoom dimulai
controls.addEventListener("start", function () {
  isZooming = true;
  stopTween();
});

//Event listener untuk memulai kembali animasi setelah zoom selesai
controls.addEventListener("end", function () {
  isZooming = false;
  startTween(new THREE.Vector3().copy(secondaryCamera.position).distanceTo(pivot1), getCurrentAngle(new THREE.Vector3().copy(secondaryCamera.position), pivot1));
});




//==================Akses elemen button (yang ada diatas canvas lihat pada html)=========================

//menggerakan kamera kembali ke kubus awal
const buttonx = document.getElementById("buttonx");
const containerButtonx = document.getElementById("container-buttonx");
var animasitransisiend = true;

buttonx.addEventListener("click", function (event) {
  kameraMenunjuMonitor = false;

  //buat cube menjadi tampak
  cube.visible = true;

  new TWEEN.Tween(scene.backgroundRotation)
    .to({ y: 0 }, 1000).start();
  //Tween untuk menggerakkan kamera
  var an1mate = new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 0, z: 30 }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(() => {
      //hidupkan objective diatas cube (tulisan h1)
      objectiveVisible = true;
    })
    .start();
  var an2mate = new TWEEN.Tween(camera.rotation)
    .to({ x: 0, y: 0, z: 0 }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  //Menambahkan event listener untuk transitionend sebelum mengubah opacity
  containerButtonx.style.opacity = "0";
  containerButtonx.addEventListener(
    "transitionend",
    function handleTransitionEnd(event) {
      containerButtonx.classList.add("hidden");
      containerButtonx.removeEventListener("transitionend", handleTransitionEnd);
      animasitransisiend = true;
    }
  );
});

function buttonOverCanvasVisible() {
  if (kameraMenunjuMonitor == true && animasitransisiend) {
    //Menampilkan elemen secara bertahap untuk memastikan transisi berjalan
    containerButtonx.classList.remove("hidden");

    setTimeout(() => {
      containerButtonx.style.opacity = "1";
    }, 10);


    animasitransisiend = false;
  }
}

const containerObjective = document.getElementById("container-objective");
var objectiveVisible = true;

function containerObjectiveVisible() {
  if (!objectiveVisible) {
    containerObjective.style.opacity = "0";
    containerObjective.addEventListener("transitionend", function handleTransitionEnd(event) {
      containerObjective.classList.add("hidden");
      containerObjective.removeEventListener("transitionend", handleTransitionEnd);
      animasitransisiend = true;
    }
    );
  } else {
    containerObjective.style.opacity = "1";
    containerObjective.classList.remove("hidden");
  }
}





//===========================modifkasi fitur tambahan terbaru (implementasi lihat find keywor "fitur")===================
const cssRenderer3D = new CSS3DRenderer();
cssRenderer3D.setSize(window.innerWidth, window.innerHeight);
cssRenderer3D.domElement.style.position = "absolute";
cssRenderer3D.domElement.style.top = 0;
document.querySelector("#css").appendChild(cssRenderer3D.domElement);


const container = document.createElement("div");
container.style.width = "1025px";
container.style.height = "728px";
container.style.background = "#1d2e2f";

const iframe = document.createElement("iframe");
iframe.src = "https://habbatul.github.io/gudang-project-kuliah/";
iframe.style.width = "1025px";
iframe.style.height = "728px";
iframe.style.border = "none";
container.appendChild(iframe);

const css3DObject = new CSS3DObject(container);
css3DObject.position.set(400, 3.27, -4.54);
css3DObject.scale.set(0.0169, 0.0162, 1);
css3DObject.rotation.set(-0.1389, 0, 0);
scene.add(css3DObject);

//Tambahkan GL Plane (Transparan untuk wadah css3drenderer) ======================
const planeGeometry = new THREE.PlaneGeometry(1025, 728);
const planeMaterial = new THREE.MeshStandardMaterial({
  opacity: 0,
  transparent: true,
  blending: THREE.NoBlending,
  side: THREE.DoubleSide,
  metalness: 5
});

const glPlane = new THREE.Mesh(planeGeometry, planeMaterial);
glPlane.position.set(css3DObject.position.x, css3DObject.position.y, css3DObject.position.z + 0.01);
glPlane.rotation.copy(css3DObject.rotation);
glPlane.scale.copy(css3DObject.scale);


//Tambahkan -plane shader (Transparan untuk css3drenderer)
const crtTVShader2 = {
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(renderTarget.width, renderTarget.height) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
        //vec2 uv = vUv;
        //coba pertimbangkan aspect ratio dan resolusi
        vec2 uv = vUv * resolution / min(resolution.x, resolution.y);

        //Efek garis lurus
        vec2 p = mod(uv * vec2(60.0, 40.0), vec2(1.0));
        float pattern = 0.9 + 0.1 * sin(30.0 * p.x * sin(time) + 30.0 * p.y * cos(time));
        pattern *= 0.95 + 0.05 * sin(32.0 * p.x * sin(time) + 32.0 * p.y * cos(time));

        //Warna dasar hitam, kita hanya akan menggunakan pola untuk warna
        vec3 finalColor = vec3(0.0);  //Hitam untuk warna dasar

        //Set alpha berdasarkan pola
        float alpha = max(pattern, 0.0); //Pastikan alpha tidak kurang dari 0

        //Gabungkan warna final dengan pola dan set alpha
        gl_FragColor = vec4(finalColor, alpha-0.8);
    }
  `,
};


var materialMonitorWeb = new THREE.ShaderMaterial({
  uniforms: THREE.UniformsUtils.clone(crtTVShader2.uniforms),
  vertexShader: crtTVShader2.vertexShader,
  fragmentShader: crtTVShader2.fragmentShader,
  transparent: true,
});

const shaderScreen = new THREE.Mesh(planeGeometry, materialMonitorWeb);
shaderScreen.position.set(css3DObject.position.x, css3DObject.position.y, css3DObject.position.z+0.012);
shaderScreen.rotation.copy(css3DObject.rotation);
shaderScreen.scale.copy(css3DObject.scale);


const screenWebGroup = new THREE.Group();

screenWebGroup.add(shaderScreen);
screenWebGroup.add(glPlane);
scene.add(screenWebGroup);

//buat isWebOpen false untuk inisiasi
var isWebOpen = false;



///==============================fitur tambahan yak ("Lanjutan akses elemen button")

const containerCSS3D = document.querySelector("#css");
const containerWebGL= document.querySelector("#webgl");

const buttonEndWeb = document.getElementById("buttonEndWeb");
const buttonControlOrbit = document.getElementById("buttonControlOrbit");
const containerButtonEndWeb = document.getElementById("containerButtonEndWeb");
const buttonx2 = document.getElementById("buttonx2");


//menuju ke mode web
buttonx2.addEventListener("click", function () {
  //matikan rotatecamera raycast
  kameraMenunjuMonitor = false;

  var distance;
  if (window.matchMedia("(min-width: 1024px)").matches) {
    distance = 8;
  } else {
    distance = 17;
  }

  //pkek pivot (ngakalin biar transisi ga ngeglitch)
  var pivot = new THREE.Vector3(400, 4, -8);
  var pivotBefore = new THREE.Vector3(400, 0, -8);

  var an1mate = new TWEEN.Tween(camera.position)
    .to({ x: 400, y: 4, z: distance })
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      camera.lookAt(pivotBefore);
    })
    .onComplete(() => {

      //rotasikan dulu ke pivot agar gerakan lebih mulus
      var startRotation = new THREE.Euler().copy(camera.rotation);
      camera.lookAt(pivot);
      var endRotation = new THREE.Euler().copy(camera.rotation);
      camera.rotation.copy(startRotation);

      new TWEEN.Tween(camera.rotation)
        .to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 500)
        .onComplete(() => {

          kameraMenunjuMonitor = true;

          //jarak antara kamera dengan objek
          rotateCameraDistance = distance;

          //mode rotasi untuk web aktif
          isWebMode = true;

          //kondisi menampilkan web (planeGL - metode blinding untuk css)
          isWebOpen = true;
          containerButtonEndWeb.classList.remove("hidden");
          containerButtonEndWeb.style.opacity = "1";
        })
        .start()
    })
    .start();

  //handle animasi transisi button dissolve
  containerButtonx.style.opacity = "0";
  containerButtonx.addEventListener(
    "transitionend",
    function handleTransitionEnd(event) {
      //setting behacvior mouse dulu
      containerCSS3D.style.pointerEvents = 'auto'; 
      containerWebGL.style.pointerEvents = 'none'; 

      containerButtonx.classList.add("hidden");


      containerButtonx.removeEventListener("transitionend", handleTransitionEnd);
    }
  );
});


//kembalikan ke posisi semula dan matikan web
buttonEndWeb.addEventListener('click', function(){
  kameraMenunjuMonitor = false;
  var pivot = new THREE.Vector3(400, 0, -8);

  var pivotBefore = new THREE.Vector3(400, 4, -8);
  
  new TWEEN.Tween(camera.position)
    .to({ x: 400, y: 8, z: 25 },800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate((v,t) => {

      //buat transisi rotasi dari pivot sebelumnya ke pivot saat ini
      const startQuaternion = camera.quaternion.clone();
      camera.lookAt(pivot); 
      const endQuaternion = camera.quaternion.clone();

      camera.quaternion.copy(startQuaternion);
      camera.quaternion.slerp(endQuaternion, t);

    })
    .onComplete(() => {
      // Setelah animasi selesai
      mouse.set(0, 0);
      rotateCameraDistance = 30;
      kameraMenunjuMonitor = true;
      isWebOpen = false;
      isWebMode = false;
    })
    .start();


  containerButtonEndWeb.style.opacity = "0";
  containerButtonEndWeb.addEventListener(
    "transitionend",
    function handleTransitionEnd(event) {

      //setting mouse nya dulu
      containerCSS3D.style.pointerEvents = 'none'; 
      containerWebGL.style.pointerEvents = 'auto'; 

      containerButtonEndWeb.classList.add("hidden");
      containerButtonx.classList.remove("hidden");
      containerButtonx.style.opacity = "1";
      containerButtonEndWeb.removeEventListener("transitionend", handleTransitionEnd);
    }
  );
})


//event aktif mode orbit control saat dari mode web
var mainCameraControls;

buttonControlOrbit.addEventListener('click', function () {
  kameraMenunjuMonitor = false; //Matikan fungsi rotatecamera raycast

  const pivot = new THREE.Vector3(400, 0, -8);

  //tidak perlu beri duration, nanti dia malah terpotong
  new TWEEN.Tween(camera.position)
    .to({ x: 400, y: 0, z: 35 })
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate((v,t) => {

      //buat transisi rotasi dari pivot sebelumnya ke pivot saat ini
      const startQuaternion = camera.quaternion.clone();
      camera.lookAt(pivot);
      const endQuaternion = camera.quaternion.clone();

      camera.quaternion.copy(startQuaternion);
      camera.quaternion.slerp(endQuaternion, t);

    })
    .onComplete(()=>{
      mainCameraControls = new OrbitControls(camera, renderer.domElement);
      mainCameraControls.enableZoom = true;
      mainCameraControls.enablePan = false;
      mainCameraControls.enableDamping = true;
      mainCameraControls.dampingFactor = 0.04;
      mainCameraControls.target.copy(pivot);
      mainCameraControls.minDistance = camera.position.z + 8;
      mainCameraControls.maxDistance = 80; 

      //handle animasi transisi button dissolve
      containerButtonWhenOrbitControl.classList.remove("hidden");
      containerButtonWhenOrbitControl.style.opacity = "1";
    })
    .start();

  //buat bisa berinteraksi dengan canvas
  containerCSS3D.style.pointerEvents = 'none';
  containerWebGL.style.pointerEvents = 'auto'; 

  //handle animasi transisi button dissolve
  containerButtonEndWeb.style.opacity = "0";
  containerButtonEndWeb.addEventListener(
    "transitionend",
    function handleTransitionEnd(event) {
      containerButtonEndWeb.classList.add("hidden");
      containerButtonEndWeb.removeEventListener("transitionend", handleTransitionEnd);
    }
  );

});

var containerButtonWhenOrbitControl = document.querySelector("#containerButtonWhenOrbitControl");
var buttonBackToWeb = document.querySelector('#buttonBackToWeb');



//button balik ke web dari mode orbit control
buttonBackToWeb.addEventListener('click', function () {
  //delete orbitcontrol
  if (mainCameraControls) {
    //Hapus semua event listener yang ditambahkan oleh OrbitControls
    mainCameraControls.dispose(); 
    mainCameraControls = null;  
  }

  //matikan rotate camera raycast
  kameraMenunjuMonitor = false;

  var distance;
  if (window.matchMedia("(min-width: 1024px)").matches) {
    distance = 9;
  } else {
    distance = 17;
  }

  //pkek pivot (ngakalin biar transisi ga ngeglitch)
  var pivot = new THREE.Vector3(400, 4, -8);

  var an1mate = new TWEEN.Tween(camera.position)
    .to({ x: 400, y: 0, z: distance }, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate((v,t) => {

      //buat transisi rotasi dari pivot sebelumnya ke pivot saat ini
      const startQuaternion = camera.quaternion.clone();
      camera.lookAt(pivot);
      const endQuaternion = camera.quaternion.clone();

      camera.quaternion.copy(startQuaternion);
      camera.quaternion.slerp(endQuaternion, t);

    })
    .onComplete(() => {
      kameraMenunjuMonitor = true;
      rotateCameraDistance = distance;
      isWebOpen = true;

      //handle animasi transisi button dissolve
      containerCSS3D.style.pointerEvents = 'auto';
      containerWebGL.style.pointerEvents = 'none';
      containerButtonEndWeb.classList.remove("hidden");
      containerButtonEndWeb.style.opacity = "1";
    }
    )
    .start();

  //handle animasi transisi button dissolve
  containerButtonWhenOrbitControl.style.opacity = "0";
  containerButtonWhenOrbitControl.addEventListener(
    "transitionend",
    function handleTransitionEnd(event) {
      //setting behacvior mouse dulu
      containerButtonWhenOrbitControl.classList.add("hidden");
      containerButtonWhenOrbitControl.removeEventListener("transitionend", handleTransitionEnd);
    }
  );
})


//cek web sedang open tidak
//disini ada render untuk **render target** dan *render css3d**
function checkScreenWebOpen() {
  if (isWebOpen) {
    if (!screenWebGroup.visible) {
      screenWebGroup.visible = true;
    }

    //hapus renderer jadi hitam
    renderer.setRenderTarget(renderTarget);
    renderer.clear();  
    renderer.setRenderTarget(null);

    cssRenderer3D.render(scene, camera);

  } else {
    if (screenWebGroup.visible) {
      screenWebGroup.visible = false;
    }

    //render ke secondary scene jika web tidak terbuka
    renderer.setRenderTarget(renderTarget);
    renderer.render(secondaryScene, secondaryCamera);
    renderer.setRenderTarget(null);
  }
}


//warm-up dummy quaternion pemanasan animasi quaternion
const warmUp = new TWEEN.Tween(camera.position)
  .to({ x: 0, y: 0, z:30 }, 10) 
  .onUpdate(() => {
    const dummyStart = camera.quaternion.clone();
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const dummyEnd = camera.quaternion.clone();
    camera.quaternion.copy(dummyStart);
    camera.quaternion.slerp(dummyEnd, 0.1);
  })
  .start();



//============================= Main =========================
//fungsi animasi
function animate() {
  requestAnimationFrame(animate);

  //rotasi cube dan event mouse ke kubus
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    onMouseMoveOnBox();
  }

  secondaryCamera.rotation.y += 0.01;

  buttonOverCanvasVisible();
  containerObjectiveVisible();

  TWEEN.update();

  materialMonitorWeb.uniforms.time.value += 0.01;

  materialMonitor.uniforms.time.value += 0.01;
  rotateCamera();

  if (mainCameraControls) {
    mainCameraControls.update();
  }

  controls.update();

  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);

  checkScreenWebOpen()
}


animate();