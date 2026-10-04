const fs = require('fs');
const path = require('path');
const { Document, NodeIO, Accessor } = require('@gltf-transform/core');

function createBoxData(width, height, depth, offsetX = 0, offsetY = 0, offsetZ = 0) {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  // 6 faces * 4 vertices = 24 vertices
  // format: [x, y, z, nx, ny, nz]
  const faces = [
    // Top (+Y)
    [[-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd], [0, 1, 0]],
    // Bottom (-Y)
    [[-hw, -hh, hd], [hw, -hh, hd], [hw, -hh, -hd], [-hw, -hh, -hd], [0, -1, 0]],
    // Front (+Z)
    [[-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd], [0, 0, 1]],
    // Back (-Z)
    [[hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd], [0, 0, -1]],
    // Right (+X)
    [[hw, -hh, hd], [hw, -hh, -hd], [hw, hh, -hd], [hw, hh, hd], [1, 0, 0]],
    // Left (-X)
    [[-hw, -hh, -hd], [-hw, -hh, hd], [-hw, hh, hd], [-hw, hh, -hd], [-1, 0, 0]]
  ];

  const positions = [];
  const normals = [];
  const indices = [];

  let vertIndex = 0;
  for (const face of faces) {
    const [v0, v1, v2, v3, norm] = face;
    const verts = [v0, v1, v2, v3];
    for (const v of verts) {
      positions.push(v[0] + offsetX, v[1] + offsetY, v[2] + offsetZ);
      normals.push(norm[0], norm[1], norm[2]);
    }
    indices.push(vertIndex, vertIndex + 1, vertIndex + 2);
    indices.push(vertIndex, vertIndex + 2, vertIndex + 3);
    vertIndex += 4;
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices)
  };
}

function attachGeometry(doc, mesh, geomData, material) {
  const prim = doc.createPrimitive();

  const posAcc = doc.createAccessor()
    .setType(Accessor.Type.VEC3)
    .setArray(geomData.positions);

  const normAcc = doc.createAccessor()
    .setType(Accessor.Type.VEC3)
    .setArray(geomData.normals);

  const idxAcc = doc.createAccessor()
    .setType(Accessor.Type.SCALAR)
    .setArray(geomData.indices);

  prim.setAttribute('POSITION', posAcc);
  prim.setAttribute('NORMAL', normAcc);
  prim.setIndices(idxAcc);
  if (material) prim.setMaterial(material);

  mesh.addPrimitive(prim);
  return prim;
}

async function buildSocietyGLB() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('SocietyScene');

  // Materials
  const matAvailable = doc.createMaterial('Mat_Available')
    .setBaseColorFactor([0.13, 0.72, 0.44, 1.0]) // Emerald Green
    .setRoughnessFactor(0.4)
    .setMetallicFactor(0.1);

  const matReserved = doc.createMaterial('Mat_Reserved')
    .setBaseColorFactor([0.96, 0.62, 0.04, 1.0]) // Amber
    .setRoughnessFactor(0.4);

  const matBooked = doc.createMaterial('Mat_Booked')
    .setBaseColorFactor([0.38, 0.40, 0.94, 1.0]) // Indigo
    .setRoughnessFactor(0.4);

  const matSold = doc.createMaterial('Mat_Sold')
    .setBaseColorFactor([0.93, 0.27, 0.27, 1.0]) // Crimson Red
    .setRoughnessFactor(0.5);

  const matRoad = doc.createMaterial('Mat_Road')
    .setBaseColorFactor([0.12, 0.14, 0.18, 1.0]) // Dark Asphalt Blacktop
    .setRoughnessFactor(0.85)
    .setMetallicFactor(0.05);

  const matMarking = doc.createMaterial('Mat_Marking')
    .setBaseColorFactor([0.95, 0.95, 0.95, 1.0]) // White
    .setRoughnessFactor(0.2);

  const matCurb = doc.createMaterial('Mat_Curb')
    .setBaseColorFactor([0.55, 0.58, 0.62, 1.0]) // Concrete Curb
    .setRoughnessFactor(0.9);

  const matTerrain = doc.createMaterial('Mat_Terrain')
    .setBaseColorFactor([0.08, 0.11, 0.16, 1.0]) // Base ground
    .setRoughnessFactor(0.95);

  const matPark = doc.createMaterial('Mat_Park')
    .setBaseColorFactor([0.08, 0.45, 0.22, 1.0]) // Park grass
    .setRoughnessFactor(0.8);

  const matTreeTrunk = doc.createMaterial('Mat_Trunk')
    .setBaseColorFactor([0.35, 0.22, 0.12, 1.0]);

  const matTreeLeaves = doc.createMaterial('Mat_Leaves')
    .setBaseColorFactor([0.16, 0.58, 0.25, 1.0]);

  // Overall Ground
  const groundMesh = doc.createMesh('Mesh_Ground');
  attachGeometry(doc, groundMesh, createBoxData(160, 0.5, 160, 0, -0.25, 0), matTerrain);
  const groundNode = doc.createNode('Ground').setMesh(groundMesh);
  scene.addChild(groundNode);

  // Society Layout Specification
  // Grid: 3 columns of plot blocks separated by north-south avenues (Road 1 and Road 2)
  // Two east-west crossing boulevards.
  // 15 plots total:
  // West Block (Plots 1, 2, 3, 4, 5)
  // Central Block (Plots 6, 7, 8, 9, 10)
  // East Block (Plots 11, 12, 13, 14, 15)

  const plotConfigs = [
    // West Block
    { name: 'Plot_001', x: -44, z: -36, w: 22, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_002', x: -44, z: -18, w: 22, d: 16, h: 2.2, mat: matReserved },
    { name: 'Plot_003', x: -44, z: 0,   w: 22, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_004', x: -44, z: 18,  w: 22, d: 16, h: 2.2, mat: matSold },
    { name: 'Plot_005', x: -44, z: 36,  w: 22, d: 16, h: 2.2, mat: matAvailable },

    // Central Block
    { name: 'Plot_006', x: 0,   z: -36, w: 24, d: 16, h: 2.2, mat: matBooked },
    { name: 'Plot_007', x: 0,   z: -18, w: 24, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_008', x: 0,   z: 0,   w: 24, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_009', x: 0,   z: 18,  w: 24, d: 16, h: 2.2, mat: matSold },
    { name: 'Plot_010', x: 0,   z: 36,  w: 24, d: 16, h: 2.2, mat: matReserved },

    // East Block
    { name: 'Plot_011', x: 44,  z: -36, w: 22, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_012', x: 44,  z: -18, w: 22, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_013', x: 44,  z: 0,   w: 22, d: 16, h: 2.2, mat: matBooked },
    { name: 'Plot_014', x: 44,  z: 18,  w: 22, d: 16, h: 2.2, mat: matAvailable },
    { name: 'Plot_015', x: 44,  z: 36,  w: 22, d: 16, h: 2.2, mat: matAvailable }
  ];

  // Add all plots as distinct nodes for Three.js raycasting
  for (const p of plotConfigs) {
    const mesh = doc.createMesh(`Mesh_${p.name}`);
    attachGeometry(doc, mesh, createBoxData(p.w, p.h, p.d, 0, p.h / 2, 0), p.mat);

    const node = doc.createNode(p.name)
      .setMesh(mesh)
      .setTranslation([p.x, 0, p.z]);

    scene.addChild(node);
  }

  // Asphalt Roads
  const roadsMesh = doc.createMesh('Mesh_Roads');
  // North-South Avenues
  attachGeometry(doc, roadsMesh, createBoxData(14, 0.4, 110, -22, 0.2, 0), matRoad);
  attachGeometry(doc, roadsMesh, createBoxData(14, 0.4, 110, 22, 0.2, 0), matRoad);
  // East-West Boulevards
  attachGeometry(doc, roadsMesh, createBoxData(120, 0.4, 14, 0, 0.2, -50), matRoad);
  attachGeometry(doc, roadsMesh, createBoxData(120, 0.4, 14, 0, 0.2, 50), matRoad);

  const roadsNode = doc.createNode('Roads').setMesh(roadsMesh);
  scene.addChild(roadsNode);

  // White Dashed Lane Markings
  const markingsMesh = doc.createMesh('Mesh_RoadMarkings');
  for (let z = -45; z <= 45; z += 10) {
    attachGeometry(doc, markingsMesh, createBoxData(0.6, 0.05, 5, -22, 0.42, z), matMarking);
    attachGeometry(doc, markingsMesh, createBoxData(0.6, 0.05, 5, 22, 0.42, z), matMarking);
  }
  for (let x = -50; x <= 50; x += 10) {
    attachGeometry(doc, markingsMesh, createBoxData(5, 0.05, 0.6, x, 0.42, -50), matMarking);
    attachGeometry(doc, markingsMesh, createBoxData(5, 0.05, 0.6, x, 0.42, 50), matMarking);
  }
  const markingsNode = doc.createNode('Road_Markings').setMesh(markingsMesh);
  scene.addChild(markingsNode);

  // Curbs / Sidewalks
  const curbMesh = doc.createMesh('Mesh_Curbs');
  attachGeometry(doc, curbMesh, createBoxData(2, 0.6, 110, -30, 0.3, 0), matCurb);
  attachGeometry(doc, curbMesh, createBoxData(2, 0.6, 110, -14, 0.3, 0), matCurb);
  attachGeometry(doc, curbMesh, createBoxData(2, 0.6, 110, 14, 0.3, 0), matCurb);
  attachGeometry(doc, curbMesh, createBoxData(2, 0.6, 110, 30, 0.3, 0), matCurb);
  const curbNode = doc.createNode('Curbs').setMesh(curbMesh);
  scene.addChild(curbNode);

  // Landscaped Park / Clubhouse Area
  const parkMesh = doc.createMesh('Mesh_Park');
  attachGeometry(doc, parkMesh, createBoxData(40, 1.2, 20, 0, 0.6, -70), matPark);
  const parkNode = doc.createNode('Community_Park').setMesh(parkMesh);
  scene.addChild(parkNode);

  // Avenue Trees
  const treesMesh = doc.createMesh('Mesh_Trees');
  const treePositions = [
    [-31, -40], [-31, -20], [-31, 0], [-31, 20], [-31, 40],
    [-13, -40], [-13, -20], [-13, 0], [-13, 20], [-13, 40],
    [13, -40], [13, -20], [13, 0], [13, 20], [13, 40],
    [31, -40], [31, -20], [31, 0], [31, 20], [31, 40]
  ];

  for (const [tx, tz] of treePositions) {
    // Trunk
    attachGeometry(doc, treesMesh, createBoxData(0.8, 3.5, 0.8, tx, 1.75, tz), matTreeTrunk);
    // Canopy
    attachGeometry(doc, treesMesh, createBoxData(3.0, 3.2, 3.0, tx, 4.5, tz), matTreeLeaves);
  }
  const treesNode = doc.createNode('Landscaping_Trees').setMesh(treesMesh);
  scene.addChild(treesNode);

  const io = new NodeIO();
  const outDir = path.join(__dirname, '../public/models');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const glbBuffer = await io.writeBinary(doc);
  const outPath = path.join(outDir, 'society.glb');
  fs.writeFileSync(outPath, Buffer.from(glbBuffer));
  console.log(`✅ Successfully generated society.glb at ${outPath} (${glbBuffer.byteLength} bytes)`);
}

buildSocietyGLB().catch(err => {
  console.error('Failed to generate society.glb:', err);
  process.exit(1);
});
