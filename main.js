import * as THREE from "three";
import { CSS2DRenderer,CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

//ambil komponen canvas dari html
const canvas = document.getElementById("canvas");

// ========================= Inisiasi threeJS ====================
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
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
music.play();


//================== Loader untuk jpeg jadi hdri juga ada cube untuk scene awal ==================
let cube;

const loaderx = new THREE.TextureLoader();
loaderx.load("hdri/cc2.jpg", function (texture) {
  // Menggunakan texture sebagai background scene
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
  // Setelah latar belakang selesai dimuat, buat objek kubus
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    envMap: rt.texture,
    roughness: 0,
    metalness: 1,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
});


//========================= Disini adalah bagian GLTF Loader ======================
const loader = new GLTFLoader();
var model;

loader.load("gltf/computerCustom.glb",function (gltf) {
    model = gltf.scene;
    model.position.set(400, -9, 4); // Set posisi model ke (0, 0, 0)
    model.scale.set(10, 10, 10); // Ubah ukuran model dengan mengatur skala
    model.name = "Cube013"; // Beri nama model
    scene.add(model); // Tambahkan model ke dalam scene

    var pointLights = [
      new THREE.PointLight(0xffffff, 20),
      new THREE.PointLight(0xffffff, 30),
      new THREE.PointLight(0xffffff, 30),
      new THREE.PointLight(0xffffff, 30),
      new THREE.PointLight(0xffffff, 20),
    ];
    pointLights[0].position.set(400, 0, 0);
    pointLights[1].position.set(410, 0, 20);
    pointLights[2].position.set(420, 0, -20);
    pointLights[3].position.set(380, 0, -20);
    pointLights[3].position.set(400, 2, -30);
    pointLights.forEach((pointLight) => {
      scene.add(pointLight);
    });

    // Buat spotlight untuk pencahayaan
    const spotLight2 = new THREE.SpotLight(0xffffff, 1000);
    spotLight2.position.set(350, 30, 50);
    spotLight2.angle = Math.PI / 10;
    spotLight2.penumbra = 1;
    spotLight2.decay = 1.2;
    spotLight2.distance = 90;

    spotLight2.target.position.set(400, 0, -4); // Atur posisi target ke (0, 0, 0)

    spotLight2.castShadow = true;

    // Atur ukuran peta bayangan
    spotLight2.shadow.mapSize.width = 512;
    spotLight2.shadow.mapSize.height = 512;

    scene.add(spotLight2);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight2);
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
  <div id="typedText">Aplikasi ini memang setengah jadi karena developernya udah capek. Mau menuju ke tempat nostalgia? </div>
  <div id="buttonContainer" style="display:flex;justify-content:center;margin-top: 20px;">
      <button id="button1" class="saira-condensed-light" style="margin-right:0.3rem;cursor:pointer;">Ayo menuju kesana</button><button id="button2" class="saira-condensed-light" style="margin-left:0.3rem;cursor:pointer;">Saya ingin disini saja</button>
  </div>
`;
text5.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text5.style.maxWidth = "400px"; //batas lebar maksimum
text5.style.height = "auto"; //inggi otomatis
text5.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text5.style.textAlign = "justify";
text5.style.padding = "1rem";
text5.style.lineHeight = "1.5";
text5.style.transition = "opacity 0.5s ease-in-out"; //animasi opacity transisi
text5.style.opacity = "0"; //set opacity awal menjadi 0
var label5 = new CSS2DObject(text5);
label5.position.set(0, 0, 5);

//label1
var textContent = `Hallo, saya Habbatul Qolbi H pembuat game ini. Selamat datang di tempat yang sangat kosong ini.`;
var text = document.createElement("div");
text.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red;margin-top:20px;text-align:center;">Klik untuk meneruskan...</div>
`;
text.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text.style.maxWidth = "400px"; //batas lebar maksimum
text.style.height = "auto"; //tinggi otomatis
text.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text.style.textAlign = "justify";
text.style.padding = "1rem";
text.style.lineHeight = "1.5";
text.style.transition = "opacity 0.5s ease-in-out"; //animasi opacity
text.style.opacity = "0"; //set opacity awal menjadi 0
var label = new CSS2DObject(text);
label.position.set(0, 0, 5);
scene.add(label);


var textContent2 = `Apakah kamu sering merasa kesepian, meskipun di tengah keramaian keluarga dan teman-teman?`;
var text2 = document.createElement("div");
text2.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;">Klik untuk meneruskan...</div>
`;
text2.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text2.style.maxWidth = "400px"; //batas lebar maksimum
text2.style.height = "auto"; //inggi otomatis
text2.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text2.style.textAlign = "justify";
text2.style.padding = "1rem";
text2.style.lineHeight = "1.5";
text2.style.transition = "opacity 0.5s ease-in-out"; //animasi opacity transisi
text2.style.opacity = "0"; //set opacity awal menjadi 0
var label2 = new CSS2DObject(text2);
label2.position.set(0, 0, 5);


var textContent3 = `Terkadang, kehadiran orang-orang di sekitar kita tidak mampu mengisi rasa hampa yang ada di dalam diri. Kesunyian terasa begitu dalam meskipun di tengah ramainya kehidupan sehari-hari.`;
var text3 = document.createElement("div");
text3.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;">Klik untuk meneruskan...</div>
`;
text3.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text3.style.maxWidth = "400px"; //batas lebar maksimum
text3.style.height = "auto"; //inggi otomatis
text3.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text3.style.textAlign = "justify";
text3.style.padding = "1rem";
text3.style.lineHeight = "1.5";
text3.style.transition = "opacity 0.5s ease-in-out"; //animasi opacity transisi
text3.style.opacity = "0"; //set opacity awal menjadi 0
var label3 = new CSS2DObject(text3);
label3.position.set(0, 0, 5);


var textContent4 = `Ayo sedikit bernostalgia menuju perangkat lama yang sudah ditinggalkan. Kita akan menjelajah mengenai masa-masa yang indah bersama.`;
var text4 = document.createElement("div");
text4.innerHTML = `
  <div id="typedText"></div>
  <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;margin-bottom:10px;">Tunggu tombol keluar..</div>
  <div id="buttonContainer" class="hidden" style="justify-content:center;margin-top: 20px;">
      <button id="button1" class="saira-condensed-light" style="margin-right:0.3rem;cursor:pointer;">Ayo menuju kesana</button><button id="button2" class="saira-condensed-light" style="margin-left:0.3rem;cursor:pointer;">Saya ingin disini saja</button>
  </div>
`;
text4.style.width = "80vw"; //ukuran teks responsif berdasarkan lebar layar
text4.style.maxWidth = "400px"; //batas lebar maksimum
text4.style.height = "auto"; //inggi otomatis
text4.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
text4.style.textAlign = "justify";
text4.style.padding = "1rem";
text4.style.lineHeight = "1.5";
text4.style.transition = "opacity 0.5s ease-in-out"; //animasi opacity transisi
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
async function animateText(textElement,textContent,speed,clickHereElement) {
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
    opacityTransitionEndHandler(label2.element, textContent2, 20);
  }
});

//event listener untuk label
label.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    opacityTransitionEndHandler(label.element, textContent, 20);
  }
});

//event listener untuk label
label3.element.addEventListener("transitionend", (event) => {
  if (event.propertyName === "opacity") {
    opacityTransitionEndHandler(label3.element, textContent3, 20);
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
    typeWriter(typedTextElement,textContent,speed,clickHereElement).then(() => {
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
      20,
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
    .easing(TWEEN.Easing.Cubic.InOut)
    .onComplete(() => {
      var startRotation = new THREE.Euler().copy(camera.rotation);

      camera.lookAt(pivot);
      var endRotation = new THREE.Euler().copy(camera.rotation);

      camera.rotation.copy(startRotation);

      new TWEEN.Tween(camera.rotation)
        .to({ x: endRotation.x, y: endRotation.y, z: endRotation.z }, 800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function () {
          console.log(camera.rotation);
        })
        .onComplete(() => {
          new TWEEN.Tween({ angle: angleValue })
            .to({ angle: Math.PI * 4.5 }, 3000)
            .onUpdate((obj) => {
              var angle = obj.angle;
              var newX = pivot.x + distance * Math.cos(angle);
              var newZ = pivot.z + distance * Math.sin(angle);
              camera.position.set(newX, initialPosition.y, newZ);
              camera.lookAt(pivot);
              console.log(camera.rotation);
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

//Muat HDR sebagai env map
new RGBELoader()
  .setDataType(THREE.FloatType)
  .load("hdri/hdr_sky.hdr", function (hdrCubeMap) {
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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

    // Efek vignette
    float radius = 0.75;
    float softness = 0.25;
    vec2 center = vec2(0.5, 0.5);
    float vignette = smoothstep(radius, radius - softness, length(uv - center));

    // Efek garis lurus
    vec2 p = mod(uv * vec2(100.0, 60.0), vec2(1.0));
    vec3 col = texture2D(tDiffuse, uv).rgb;
    col *= 0.9 + 0.1 * sin(30.0 * p.x * sin(time) + 30.0 * p.y * cos(time));
    col *= 0.95 + 0.05 * sin(32.0 * p.x * sin(time) + 32.0 * p.y * cos(time));
    
    // Gabungkan efek vignette dan garis lurus
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
function rotateCamera() {
  if (kameraMenunjuMonitor) {
    const pivot = new THREE.Vector3(400, -9, 4);
    const pivot2 = new THREE.Vector3(400, 0, -8);
    const pivot3 = new THREE.Vector3(400, 0, 0);
    const distance = 30;

    //Membatasi rotasi
    const angleX = 1.5 + Math.min(Math.max(mouse.x, -0.5), 0.5) * (Math.PI / 4);
    const angleY = Math.min(Math.max(-mouse.y + 1, 0.5), 10) * (Math.PI / 4);

    const newX = pivot.x + distance * Math.cos(angleX);
    const newY = pivot.y + distance * Math.sin(angleY);
    const newZ = pivot3.z + distance * Math.sin(angleX);

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
var InitialAngle1 = 1.5;
var tween;
var rotate1;

var isMouseDown = false;
var isZooming = false;

function initialAnimation(distanceFromPivot) {
  tween = new TWEEN.Tween(secondaryCamera.position)
    .to(
      {
        x: pivot1.x + distanceFromPivot * Math.cos(InitialAngle1),
        y: 0,
        z: pivot1.z + distanceFromPivot * Math.sin(InitialAngle1),
      },
      500
    )
    .onComplete(() => {
      rotate1 = new TWEEN.Tween({ angle: 1.5 })
        .to({ angle: Math.PI * 2.5 }, 4000)
        .onUpdate((obj) => {
          var angle = obj.angle;
          var newX = pivot1.x + distanceFromPivot * Math.cos(angle);
          var newZ = pivot1.z + distanceFromPivot * Math.sin(angle);
          secondaryCamera.position.set(newX, 0, newZ);
          secondaryCamera.lookAt(pivot1);
        })
        .repeat(Infinity)
        .start();
    })
    .start();
}

initialAnimation(distance1);

//Memulai Tween jika tidak sedang menahan tombol mouse
function startTween(distance) {
  if (!isMouseDown && !isZooming) {
    initialAnimation(distance);
  }
}

//Menghentikan Tween saat menahan tombol mouse
function stopTween() {
  if (isMouseDown || isZooming) {
    tween.stop();
    if (rotate1) rotate1.stop(); 
  }
}

//Event listener untuk mouse down dan mouse up
function onMouseDown(event) {
  isMouseDown = true;
  stopTween();
}

function onMouseUp(event) {
  isMouseDown = false;
  startTween(
    new THREE.Vector3().copy(secondaryCamera.position).distanceTo(pivot1)
  );
}

//Event listener untuk mouse move, mouse down, dan mouse up
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

//Event listener untuk touch start dan touch end
document.addEventListener("touchstart",function (event) {
    onMouseDown(event.touches[0]);
  },
  false
);

document.addEventListener("touchend",function (event) {
    onMouseUp(
      event.touches.length === 0
        ? { clientX: 0, clientY: 0 }
        : event.touches[0]
    );
  },
  false
);

// Event listener untuk menghentikan animasi saat zoom dimulai
controls.addEventListener("start", function () {
  isZooming = true;
  stopTween();
});

// Event listener untuk memulai kembali animasi setelah zoom selesai
controls.addEventListener("end", function () {
  isZooming = false;
  startTween(
    new THREE.Vector3().copy(secondaryCamera.position).distanceTo(pivot1)
  );
});


//==================Akses elemen button (yang ada diatas canvas lihat pada html)=========================
const buttonx = document.getElementById("buttonx");
const containerButtonx = document.getElementById("container-buttonx");
var animasitransisiend = true;

buttonx.addEventListener("click", function (event) {
  kameraMenunjuMonitor = false;

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
      containerButtonx.removeEventListener("transitionend",handleTransitionEnd);
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
    containerObjective.addEventListener("transitionend",function handleTransitionEnd(event) {
        containerObjective.classList.add("hidden");
        containerObjective.removeEventListener("transitionend",handleTransitionEnd);
        animasitransisiend = true;
      }
    );
  } else {
    containerObjective.style.opacity = "1";
    containerObjective.classList.remove("hidden");
  }
}

//fungsi animasi
function animate() {
  requestAnimationFrame(animate);

  if(cube){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    onMouseMoveOnBox();
  }

  secondaryCamera.rotation.y += 0.01;

  buttonOverCanvasVisible();
  containerObjectiveVisible();

  TWEEN.update();

  materialMonitor.uniforms.time.value += 0.01;
  rotateCamera();

  controls.update();
  renderer.setRenderTarget(renderTarget);
  renderer.render(secondaryScene, secondaryCamera);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}


animate();