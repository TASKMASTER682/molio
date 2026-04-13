// components/ThreeScene.js
"use client";

import { useEffect, useRef } from "react";

function createCapsule(radius, length, capSegments, radialSegments) {
  const THREE = window.THREE;
  const geometry = new THREE.BufferGeometry();
  const cylinder = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const sphereTop = new THREE.SphereGeometry(radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2);
  const sphereBottom = new THREE.SphereGeometry(radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  
  sphereTop.translate(0, length / 2, 0);
  sphereBottom.translate(0, -length / 2, 0);
  
  const positions = [];
  const normals = [];
  
  [cylinder, sphereTop, sphereBottom].forEach(geo => {
    const pos = geo.attributes.position.array;
    const norm = geo.attributes.normal.array;
    for (let i = 0; i < pos.length; i++) {
      positions.push(pos[i]);
      normals.push(norm[i]);
    }
  });
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}

export function ThreeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.THREE) return;

    const canvas = canvasRef.current;
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    function setSize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-2, 1.2, 7);
    camera.lookAt(-1, 0.5, 0);

    const ambLight = new THREE.AmbientLight(0x334455, 0.8);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimCyan = new THREE.PointLight(0x00f5ff, 2, 8);
    rimCyan.position.set(-3, 2, -1);
    scene.add(rimCyan);

    const rimMag = new THREE.PointLight(0x7b2fff, 1.5, 8);
    rimMag.position.set(2, -1, 2);
    scene.add(rimMag);

    const laptopGlow = new THREE.PointLight(0x00f5ff, 3, 2);
    laptopGlow.position.set(-1, 0.4, 0.4);
    scene.add(laptopGlow);

    const skinMat = new THREE.MeshPhongMaterial({ color: 0xc68642, shininess: 30 });
    const skinDarkMat = new THREE.MeshPhongMaterial({ color: 0xb5752e, shininess: 20 });
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x1a1008, shininess: 10 });
    const eyeWhiteMat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 80 });
    const eyePupilMat = new THREE.MeshPhongMaterial({ color: 0x0a0a0a, shininess: 100 });
    const eyeGlowMat = new THREE.MeshPhongMaterial({ color: 0x00f5ff, shininess: 200, emissive: 0x00a0bb, emissiveIntensity: 0.5 });
    const glassesMat = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 200, specular: 0x00f5ff });
    const lenseMat = new THREE.MeshPhongMaterial({ color: 0x002233, transparent: true, opacity: 0.4, shininess: 300, specular: 0xffffff });
    const hoodieMat = new THREE.MeshPhongMaterial({ color: 0x1a1a2e, shininess: 20 });
    const hoodieAccentMat = new THREE.MeshPhongMaterial({ color: 0x00c8d4, shininess: 60, emissive: 0x004448, emissiveIntensity: 0.4 });
    const headphoneMat = new THREE.MeshPhongMaterial({ color: 0x222233, shininess: 80, specular: 0x4444ff });
    const laptopMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, shininess: 150, specular: 0x888888 });
    const screenMat = new THREE.MeshPhongMaterial({ color: 0x0a1a2e, shininess: 200, emissive: 0x003366, emissiveIntensity: 0.8 });
    const deskMat = new THREE.MeshPhongMaterial({ color: 0x0f0f14, shininess: 80, specular: 0x111133 });

    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 1.4), deskMat);
    desk.position.set(-1, -0.5, 0);
    desk.receiveShadow = true;
    scene.add(desk);

    [[-1.6,-0.6,-0.55],[0.6,-0.6,-0.55],[-1.6,-0.6,0.55],[0.6,-0.6,0.55]].forEach(([x,y,z]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.45,8), deskMat);
      leg.position.set(x,y,z); scene.add(leg);
    });

    const monBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.04,16), deskMat);
    monBase.position.set(-0.8, -0.46, -0.2);
    scene.add(monBase);
    const monPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.5,8), deskMat);
    monPole.position.set(-0.8, -0.22, -0.2);
    scene.add(monPole);
    const monScreen = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.52, 0.03), laptopMat);
    monScreen.position.set(-0.8, 0.1, -0.2);
    scene.add(monScreen);
    const monDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.45), new THREE.MeshPhongMaterial({
      color: 0x0d2040, emissive: 0x0a1830, emissiveIntensity: 1.2, shininess: 300
    }));
    monDisplay.position.set(-0.8, 0.1, -0.18);
    scene.add(monDisplay);
    const monGlow = new THREE.PointLight(0x004488, 1.5, 2);
    monGlow.position.set(-0.8, 0.1, 0);
    scene.add(monGlow);

    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.025, 0.5), laptopMat);
    laptopBase.position.set(-1, -0.46, 0.2);
    laptopBase.castShadow = true;
    scene.add(laptopBase);

    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.46, 0.02), laptopMat);
    laptopLid.rotation.x = -0.9;
    laptopLid.position.set(-1, -0.22, -0.06);
    laptopLid.castShadow = true;
    scene.add(laptopLid);

    const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.63, 0.4), screenMat);
    laptopScreen.rotation.x = -0.9;
    laptopScreen.position.set(-1, -0.2, -0.05);
    scene.add(laptopScreen);

    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.045,0.12,16), new THREE.MeshPhongMaterial({color:0x222233,shininess:60}));
    mug.position.set(0.5,-0.44,0.1);
    scene.add(mug);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,8,12,Math.PI), new THREE.MeshPhongMaterial({color:0x222233}));
    mugHandle.rotation.y = Math.PI/2;
    mugHandle.position.set(0.535,-0.44,0.1);
    scene.add(mugHandle);

    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.8), new THREE.MeshPhongMaterial({color:0x111118,shininess:30}));
    chairSeat.position.set(-1, -1.05, 0.5);
    scene.add(chairSeat);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.7, 0.06), new THREE.MeshPhongMaterial({color:0x111118}));
    chairBack.position.set(-1, -0.7, 0.12);
    scene.add(chairBack);

    const character = new THREE.Group();
    character.position.set(-1, -0.1, 0.4);

    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.55, 16);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, -0.05, 0);
    torso.castShadow = true;
    character.add(torso);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.02), hoodieAccentMat);
    pocket.position.set(0, -0.22, 0.29);
    character.add(pocket);

    const strMat = hoodieAccentMat;
    [-0.04, 0.04].forEach(ox => {
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,0.15,6), strMat);
      str.position.set(ox, 0.12, 0.28);
      str.rotation.z = ox > 0 ? -0.2 : 0.2;
      character.add(str);
    });

    const lArm = new THREE.Group();
    const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.28, 12), hoodieMat);
    lUpperArm.position.set(0, -0.14, 0);
    lArm.add(lUpperArm);
    const lForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.24, 12), skinMat);
    lForeArm.position.set(0, -0.38, 0);
    lArm.add(lForeArm);
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), skinMat);
    lHand.position.set(0, -0.54, 0);
    lArm.add(lHand);
    lArm.position.set(-0.36, 0.08, 0);
    lArm.rotation.z = 0.55;
    lArm.rotation.x = 0.9;
    character.add(lArm);

    const rArm = new THREE.Group();
    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.28, 12), hoodieMat);
    rUpperArm.position.set(0, -0.14, 0);
    rArm.add(rUpperArm);
    const rForeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.24, 12), skinMat);
    rForeArm.position.set(0, -0.38, 0);
    rArm.add(rForeArm);
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), skinMat);
    rHand.position.set(0, -0.54, 0);
    rArm.add(rHand);
    rArm.position.set(0.36, 0.08, 0);
    rArm.rotation.z = -0.55;
    rArm.rotation.x = 0.9;
    character.add(rArm);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.18, 12), skinDarkMat);
    neck.position.set(0, 0.32, 0);
    character.add(neck);

    const head = new THREE.Group();
    head.position.set(0, 0.72, 0);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 20), skinMat);
    headMesh.scale.set(1, 1.08, 0.95);
    head.add(headMesh);

    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), skinDarkMat);
    earL.position.set(-0.27, 0, 0);
    earL.scale.set(0.5, 0.75, 0.7);
    head.add(earL);
    const earR = earL.clone();
    earR.position.set(0.27, 0, 0);
    head.add(earR);

    const eyeGroup = new THREE.Group();

    const eyeWL = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 12), eyeWhiteMat);
    eyeWL.position.set(-0.1, 0.04, 0.24);
    eyeWL.scale.set(1, 1.1, 0.85);
    eyeGroup.add(eyeWL);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 10), eyePupilMat);
    pupilL.position.set(-0.1, 0.04, 0.268);
    eyeGroup.add(pupilL);
    const irisL = new THREE.Mesh(new THREE.CircleGeometry(0.028, 16), eyeGlowMat);
    irisL.position.set(-0.1, 0.04, 0.272);
    eyeGroup.add(irisL);
    const hlL = new THREE.Mesh(new THREE.CircleGeometry(0.01, 8), eyeWhiteMat);
    hlL.position.set(-0.09, 0.055, 0.274);
    eyeGroup.add(hlL);

    const eyeWR = eyeWL.clone();
    eyeWR.position.set(0.1, 0.04, 0.24);
    eyeGroup.add(eyeWR);
    const pupilR = pupilL.clone();
    pupilR.position.set(0.1, 0.04, 0.268);
    eyeGroup.add(pupilR);
    const irisR = irisL.clone();
    irisR.position.set(0.1, 0.04, 0.272);
    eyeGroup.add(irisR);
    const hlR = hlL.clone();
    hlR.position.set(0.11, 0.055, 0.274);
    eyeGroup.add(hlR);

    head.add(eyeGroup);

    const browMat = new THREE.MeshPhongMaterial({ color: 0x1a1008 });
    [-0.1, 0.1].forEach(bx => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.015, 0.015), browMat);
      brow.position.set(bx, 0.12, 0.264);
      brow.rotation.z = bx < 0 ? 0.15 : -0.15;
      head.add(brow);
    });

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), skinDarkMat);
    nose.position.set(0, -0.04, 0.27);
    nose.scale.set(1.1, 0.8, 1);
    head.add(nose);

    const smilePath = new THREE.TorusGeometry(0.07, 0.01, 8, 20, Math.PI * 0.6);
    const smile = new THREE.Mesh(smilePath, new THREE.MeshPhongMaterial({ color: 0x7a3520 }));
    smile.position.set(-0.015, -0.1, 0.26);
    smile.rotation.z = Math.PI * 0.15;
    head.add(smile);

    const hairVerts = [
      [0, 0.28, 0], [-0.12, 0.25, 0.08], [0.12, 0.25, 0.06],
      [-0.18, 0.18, 0.05], [0.18, 0.18, 0.05], [0.05, 0.28, -0.08],
      [-0.08, 0.22, -0.1], [0.08, 0.22, -0.09]
    ];
    hairVerts.forEach(([hx,hy,hz]) => {
      const tuft = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random()*0.04, 8, 6),
        hairMat
      );
      tuft.position.set(hx, hy, hz);
      tuft.scale.set(0.8+Math.random()*0.3, 1+Math.random()*0.4, 0.8+Math.random()*0.3);
      head.add(tuft);
    });

    const glassGroup = new THREE.Group();
    const frameL = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.012, 8, 24), glassesMat);
    frameL.position.set(-0.1, 0.04, 0.245);
    frameL.scale.set(1, 0.85, 1);
    glassGroup.add(frameL);
    const lensL = new THREE.Mesh(new THREE.CircleGeometry(0.062, 20), lenseMat);
    lensL.position.set(-0.1, 0.04, 0.248);
    glassGroup.add(lensL);
    const frameR = frameL.clone();
    frameR.position.set(0.1, 0.04, 0.245);
    glassGroup.add(frameR);
    const lensR = lensL.clone();
    lensR.position.set(0.1, 0.04, 0.248);
    glassGroup.add(lensR);
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.1, 8), glassesMat);
    bridge.rotation.z = Math.PI/2;
    bridge.position.set(0, 0.04, 0.245);
    glassGroup.add(bridge);
    [-0.168, 0.168].forEach(tx => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 6), glassesMat);
      arm.rotation.z = Math.PI/2;
      arm.rotation.x = 0.2;
      arm.position.set(tx > 0 ? 0.22 : -0.22, 0.03, 0.18);
      glassGroup.add(arm);
    });
    head.add(glassGroup);

    const hpGroup = new THREE.Group();
    const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.025, 10, 30, Math.PI), headphoneMat);
    hpBand.rotation.z = Math.PI;
    hpBand.position.set(0, 0.08, 0);
    hpGroup.add(hpBand);
    [-0.26, 0.26].forEach(hpx => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), headphoneMat);
      cup.rotation.z = Math.PI/2;
      cup.position.set(hpx, 0.08, 0);
      hpGroup.add(cup);
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16), new THREE.MeshPhongMaterial({color:0x111122,shininess:20}));
      pad.rotation.z = Math.PI/2;
      pad.position.set(hpx > 0 ? hpx+0.024 : hpx-0.024, 0.08, 0);
      hpGroup.add(pad);
    });
    hpGroup.position.set(0, 0.28, 0);
    hpGroup.rotation.x = 0.3;
    character.add(hpGroup);

    character.add(head);

    const legMat = new THREE.MeshPhongMaterial({ color: 0x1a1a2e });
    [[-0.13,-0.68],[ 0.13,-0.68]].forEach(([lx,ly]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.35, 12), legMat);
      leg.position.set(lx, ly, 0);
      leg.rotation.x = 0.35;
      character.add(leg);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 0.28), new THREE.MeshPhongMaterial({color:0x111111,shininess:60}));
      shoe.position.set(lx, ly-0.4, 0.1);
      character.add(shoe);
    });

    scene.add(character);

    const particleGeo = new THREE.BufferGeometry();
    const pCount = 120;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0;i<pCount*3;i++) pPos[i] = (Math.random()-0.5)*10;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
    const particleMat = new THREE.PointsMaterial({ color:0x00f5ff, size:0.025, transparent:true, opacity:0.6 });
    scene.add(new THREE.Points(particleGeo, particleMat));

    let mouseX = 0, mouseY = 0;
    let blinkT = 0, blinkOpen = true;
    let nextBlink = 3 + Math.random()*3;
    let typingT = 0;
    let breathT = 0;

    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX/window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY/window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', setSize);
    setSize();

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      breathT = Math.sin(t * 0.9) * 0.012;
      character.scale.y = 1 + breathT;

      head.rotation.y += (mouseX * 0.35 - head.rotation.y) * 0.05;
      head.rotation.x += (-mouseY * 0.18 - head.rotation.x) * 0.05;

      const eyeOffX = mouseX * 0.015;
      const eyeOffY = mouseY * 0.01;
      pupilL.position.set(-0.1 + eyeOffX, 0.04 + eyeOffY, 0.268);
      pupilR.position.set( 0.1 + eyeOffX, 0.04 + eyeOffY, 0.268);
      irisL.position.set(-0.1 + eyeOffX, 0.04 + eyeOffY, 0.272);
      irisR.position.set( 0.1 + eyeOffX, 0.04 + eyeOffY, 0.272);

      if(t > nextBlink && blinkOpen) {
        blinkOpen = false;
        nextBlink = t + 0.18;
      }
      if(!blinkOpen && t > nextBlink) {
        blinkOpen = true;
        nextBlink = t + 2.5 + Math.random()*3;
      }
      const blinkScale = blinkOpen ? 1 : 0.05;
      eyeWL.scale.y = THREE.MathUtils.lerp(eyeWL.scale.y, blinkScale * 1.1, 0.25);
      eyeWR.scale.y = THREE.MathUtils.lerp(eyeWR.scale.y, blinkScale * 1.1, 0.25);

      typingT = t;
      lArm.rotation.x = 0.9 + Math.sin(typingT * 8) * 0.06;
      rArm.rotation.x = 0.9 + Math.sin(typingT * 8 + Math.PI) * 0.06;

      const flicker = 0.8 + Math.sin(t * 0.5) * 0.1;
      laptopGlow.intensity = flicker * 3;

      character.position.y = -0.1 + Math.sin(t * 0.6) * 0.015;

      particleGeo.rotateY(0.0002);

      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return <canvas id="three-canvas" ref={canvasRef} />;
}