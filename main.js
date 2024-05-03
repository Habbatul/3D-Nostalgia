import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

//buat elemen canvas baru
const canvas = document.getElementById('canvas');

//buat scene, kamera, dan renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias:true, powerPreference:"high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.antialias=true;




    //tambahkan pencahayaan titik
    var pointLights = [
        new THREE.PointLight(0xffffff, 30),
        new THREE.PointLight(0xffffff, 30),
        new THREE.PointLight(0xffffff, 30),
        new THREE.PointLight(0xffffff, 30),
        new THREE.PointLight(0xffffff, 30),
        new THREE.PointLight(0xffffff, 30)
    ];

    pointLights[0].position.set(0, 10, 0);
    pointLights[1].position.set(0, -10, 0);
    pointLights[2].position.set(10, 0, 0);
    pointLights[3].position.set(-10, 0, 0);
    pointLights[4].position.set(0, 0, 10);
    pointLights[5].position.set(0, 0, -10);

    pointLights.forEach(pointLight => {
        scene.add(pointLight);

        // //penanda
        // var sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        // var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // sphere.position.copy(pointLight.position);
        // scene.add(sphere);
    });


    //tambahkan sebuah kubus ke dalam scene
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });              
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    //tambahkan sebuah plane untuk lantai
    var floorGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
    var floorMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -10;
    scene.add(floor);

    camera.position.z = 30;


    //buat container untuk renderer CSS2D
    var cssContainer = document.createElement('div');
    cssContainer.style.position = 'fixed';
    cssContainer.style.top = 0;
    cssContainer.style.pointerEvents = 'none'; //memastikan bahwa elemen ini tidak menghalangi interaksi dengan elemen di bawahnya (ini nanti diubah2)
    document.body.appendChild(cssContainer);

    //buat renderer CSS2D di dalam container
    var cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssContainer.appendChild(cssRenderer.domElement);

    //tambahkan teks "Hello, World!" ke dalam kubus
    var textContent = `Hallo, saya Habbatul Qolbi H pembuat game ini. Selamat datang di tempat yang sangat kosong ini.`;
    var text = document.createElement('div');
    text.innerHTML = `
        <div id="typedText"></div>
        <div id="clickHere" style="color: red;margin-top:20px;text-align:center;">Klik untuk meneruskan...</div>
    `;
    text.style.width = '80vw'; //ukuran teks responsif berdasarkan lebar layar
    text.style.maxWidth = '400px'; //batas lebar maksimum
    text.style.height = 'auto'; //tinggi otomatis
    text.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    text.style.textAlign = 'justify';
    text.style.padding = '1rem';
    text.style.lineHeight = '1.5';
    text.style.transition = 'opacity 0.5s ease-in-out'; //animasi opacity
    text.style.opacity = '0'; //set opacity awal menjadi 0
    var label = new CSS2DObject(text);
    label.position.set(0, 0, 5);
    scene.add(label);


    //tambahkan teks "Hello, World!" ke dalam kubus
    var textContent2 = `Apakah kamu sering merasa kesepian, meskipun di tengah keramaian keluarga dan teman-teman? Terkadang, kehadiran orang-orang di sekitar kita tidak mampu mengisi rasa hampa yang ada di dalam diri. Kesunyian terasa begitu dalam meskipun di tengah ramainya kehidupan sehari-hari.`;

    var text2 = document.createElement('div');
    text2.innerHTML = `
        <div id="typedText"></div>
        <div id="clickHere" style="color: red; margin-top: 20px;text-align:center;">Klik untuk meneruskan...</div>
    `;
    text2.style.width = '80vw'; //ukuran teks responsif berdasarkan lebar layar
    text2.style.maxWidth = '400px'; //batas lebar maksimum
    text2.style.height = 'auto'; //inggi otomatis
    text2.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    text2.style.textAlign = 'justify';
    text2.style.padding = '1rem';
    text2.style.lineHeight = '1.5';
    text2.style.transition = 'opacity 0.5s ease-in-out'; //animasi opacity transisi
    text2.style.opacity = '0'; //set opacity awal menjadi 0
    var label2 = new CSS2DObject(text2);
    label2.position.set(0, 0, 5);

    //kondisional, digunakan untuk mencegah kodingan dalam eventhandler label bekerja ketika animasi berjalan
    var isTyping = true;

    function typeWriter(textElement, text, speed, clickHereElement) {
        return new Promise((resolve) => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    textElement.textContent += text.charAt(i);
                    i++;
                    requestAnimationFrame(type);
                    //jika opacity 0 maka kosongkan teks
                } else {
                    //kembalikan kondisi false bila ketiks selesai
                    isTyping=false;
                    resolve();
                    clickHereElement.style.color ="blue";
                }
            }
            type();
        });
    }

    //animasi ketik untuk menampilkan teks
    async function animateText(textElement, textContent, speed, clickHereElement) {
         //hapus teks sebelum memulai animasi ketik
        textElement.textContent = '';
        await typeWriter(textElement, textContent, speed, clickHereElement);
    }

    //ketika opacity mencapai 1, jalankan animasi mengetik
    function opacityTransitionEndHandler(labelElement, textContent, speed) {
        //kondisi typing true sebelum ke animasi typing (agar tidak terjadi glitch animasi)
        isTyping = true;
        var typedTextElement = labelElement.querySelector('#typedText');
        var clickHereElement = labelElement.querySelector('#clickHere');
        clickHereElement.style.color ='red';
        if (labelElement.style.opacity === '1') {
            animateText(typedTextElement, textContent, speed, clickHereElement);
        } else if (labelElement.style.opacity === '0') {
            typedTextElement.textContent = ''; //kosongkan teks saat opacity kembali menjadi 0
        }
    }
    //event listener untuk label2
    label2.element.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'opacity') {
            opacityTransitionEndHandler(label2.element, textContent2, 1000);
        }
    });

    //event listener untuk label
    label.element.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'opacity') {
            opacityTransitionEndHandler(label.element, textContent, 1000);
        }
    });




  
    //definisikan object raycaster dan mouse untuk interaksi mouse dengan scene
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(-2, -2); 

    //deteksi mouse agar bisa realtime
    function onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    window.addEventListener('mousemove', onMouseMove, false); 


    //kondisional untuk textbox
    var gotoStep=0;

    //step 1
    label.element.addEventListener('click', function(event) {
        //jika animasi typing tidak berjalan
        if(!isTyping){
            label.element.style.opacity ='0';
            scene.add(label2);
            gotoStep=2;
            //ini dijalankan ketika label ada bukan ketika gotoStep=1
            label.element.addEventListener('transitionend', function(event){
                if(gotoStep==2){
                    console.log("step satu dijalankan")
                    scene.remove(label);
                    
                    //gunakan disini karena pasti tidak bisa dihindarkan dari hover jadi nantinya animasi akan tetap berjalan
                    label2.element.style.opacity ='1';
                }
            });
        }
    });

    //step 1
    label.element.addEventListener('mouseover', function(event) {
        label.element.style.cursor = 'pointer'
    });

    //step 2
    label2.element.addEventListener('click', function(event) {
        //jika animasi typing tidak berjalan
        if(!isTyping){
            gotoStep=3;
            label2.element.style.opacity ='0';
            label2.element.addEventListener('transitionend', function(event){
                if(gotoStep==3){
                    scene.remove(label2)
                    gotoStep=0;
                    cssContainer.style.pointerEvents = 'none';
                    scene.add(label);

                    //setelah selesai klik nya atur mouse agar
                    mouse.set(-2, -2);
                }
            });
        }
    });

    //step 2
    label2.element.addEventListener('mouseover', function(event) {
        label2.element.style.cursor = 'pointer';
    });


    //step 0
    //tambahkan event listener untuk mousedown pada saat kursor berada pada kubus
    function onMouseDownOnBox(event) {
        
        raycaster.setFromCamera(mouse, camera);
        
        var intersects = raycaster.intersectObjects([cube], true);

        if (intersects.length > 0) {
            
            if (gotoStep===0) {
                cube.material.color.set(0xff0000);
                gotoStep=1;
                label.element.style.opacity = '1';
                label.element.addEventListener('transitionend', function(event){
                    cssContainer.style.pointerEvents = 'auto';
                });
            } 
        }
    }
    document.addEventListener('click', onMouseDownOnBox, false);

    //tambahkan event listener ketika kursor mouse bergerak dan berada pada kubus
    //ini dijalankan difungsi animate (agar realtime)
    function onMouseMoveOnBox() {
        
        raycaster.setFromCamera(mouse, camera);
        
        var intersects = raycaster.intersectObjects([cube], true);
        
        //memperhatikan kondisi jumlah pesan
        if (intersects.length > 0) {
            if(gotoStep==0){
                canvas.style.cursor = 'pointer';
                cube.material.color.set(0xff0000);
            }else{
                cssContainer.style.pointerEvents = 'auto';

                //kondisional agar box tetap merah saat box ada
                if(gotoStep===0)
                    cube.material.color.set(0x00ff00);
            }
        } else {
                canvas.style.cursor = 'auto';

                //kondisional agar box tetap merah saat box ada
                if(gotoStep===0)
                    cube.material.color.set(0x00ff00);
        }
    }



    //fungsi animasi
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        onMouseMoveOnBox();
        renderer.render(scene, camera);
        cssRenderer.render(scene, camera);
        console.log(isTyping);console.log(gotoStep);
    }

    animate();