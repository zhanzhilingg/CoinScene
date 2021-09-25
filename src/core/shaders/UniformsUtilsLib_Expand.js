
var THREE = require('./three')

THREE.UniformsLib.LightShaderNew = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    time: { value: null },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}
THREE.UniformsLib.LightShader = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    time: { value: null },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}


//////////////////////////////////////
THREE.UniformsLib.CutShader1 = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    type: { type: "int", value: 0 },
    depth: { value: 0.0 },
    time: { value: null },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    },
    color: { type: "v3", value: null },
    tDiffuse: { type: "t", value: null },
}


////////////////////////////////////////////
THREE.UniformsLib.CutShader2 = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    time: { value: null },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    scale: {value: [1.0, 1.0, 1.0]},
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    },
    color: { type: "v3", value: null },
    tDiffuse: { type: "t", value: null },
}



/////////////////////////////////////////
THREE.UniformsLib.CutShader3 = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    type: { type: "int", value: 1 },
    depth: { value: 0.0 },
    time: { value: null },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    center: { value: null },
    scale: {value: [1.0, 1.0, 1.0]},
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    },
    color: { type: "v3", value: null },
    tDiffuse: { type: "t", value: null },
}





/////////////////////////////////////
THREE.UniformsLib.CutShader3_1 = {
    amplitude: { value: 0.0 },
    customColor: { value: null },
    lPosition: { value: null },
    lPosition2: { value: null },
    type: { type: "int", value: 0 },
    depth: { value: 0.0 },
    time: { value: null },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    },
    color: { type: "v3", value: null },
    tDiffuse: { type: "t", value: null },
}



//////////////////////////////////////////
THREE.UniformsLib.CutShader4 = {
    "color": { type: "v3", value: null },
    "tDiffuse": { type: "t", value: null },
}

//////////////////////////////////////////
THREE.UniformsLib.CutShader5 = {
    "color": { type: "v3", value: null },
    "tDiffuse": { type: "t", value: null },
}




//////////////////////////////////////////
THREE.UniformsLib.CutShader6 = {
    cutNum: { type: "int", value: 0 },
    radius: { type: "float", value: 0.0 },
    radiusAdd: { type: "float", value: 0.0 },
    cutHalfCircle: { type: "float", value: 0.0 },
    cutRYNum: { type: "int", value: 0 },
    cutType: { type: "int", value: 0 },
    cutXyz: { value: [0.0, 0.0, 0.0] },
    cutRYxyz: { value: [0.0, 0.0, 0.0] },
    scaling1: { value: [1.0, 1.0, 1.0] },
    scaling2: { value: [1.0, 1.0, 1.0] },
    scaling3: { value: [1.0, 1.0, 1.0] },
    scale: {value: [1.0, 1.0, 1.0]},
    cutZX: { value: [0.0, 0.0, 0.0] }, //x: 位置； y: 角度； z: A、B面（1A,2B）
    gridFigure: { value: [] },
    centerPoint: { value: [] },
    min: { value: [] },
    max: { value: [] },
    center: { value: [0.0, 0.0, 0.0] },
    offset: { value: 0.0 },
    emissive: { value: [0.0, 0.0, 0.0] },
    customColor: { value: [0.0, 0.0, 0.0] },
    lPosition: { value: [0.0, 0.0, 0.0] },
    lPosition2: { value: [0.0, 0.0, 0.0] },
    modeltype: { value: 0 },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}




//////////////////////////////////////////
THREE.UniformsLib.CutShader7 = {
    radius: { type: "float", value: 0.0 },
    radiusAdd: { type: "float", value: 0.0 },
    cutHalfCircle: { type: "float", value: 0.0 },
    cutType: { type: "int", value: 0 },
    cutXyz: { value: [0.0, 0.0, 0.0] },
    gridFigure: { value: [] },
    centerPoint: { value: [] },
    center: { value: [0.0, 0.0, 0.0] },
    offset: { value: 0.0 },
    emissive: { value: [0.0, 0.0, 0.0] },
    customColor: { value: [0.0, 0.0, 0.0] },
    lPosition: { value: [0.0, 0.0, 0.0] },
    lPosition2: { value: [0.0, 0.0, 0.0] },
    modeltype: { value: 0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}



//////////////////////////////////////////
THREE.UniformsLib.CutShader8 = {
    cutNum: { type: "int", value: 0 },
    cutRYNum: { value: [] },
    cutType: { type: "int", value: 0 },
    cutXyz: { value: [] },
    cutRYxyz: { value: [] },
    scaling1: { value: [1.0, 1.0, 1.0] },
    scaling2: { value: [1.0, 1.0, 1.0] },
    scaling3: { value: [1.0, 1.0, 1.0] },
    gridFigure: { value: [] },
    center: { value: [0.0, 0.0, 0.0] },
    offset: { value: 0.0 },
    emissive: { value: [0.0, 0.0, 0.0] },
    customColor: { value: [0.0, 0.0, 0.0] },
    lPosition: { value: [0.0, 0.0, 0.0] },
    lPosition2: { value: [0.0, 0.0, 0.0] },
    modeltype: { value: 0 },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    scale: {value: [1.0, 1.0, 1.0]},
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}


////////////////////////////////////////
THREE.UniformsLib.CutShader9 = {
    cutNum: { type: "int", value: 0 },
    cutRYNum: { value: [] },
    cutType: { type: "int", value: 0 },
    cutXyz: { value: [] },
    cutRYxyz: { value: [] },
    scaling1: { value: [1.0, 1.0, 1.0] },
    scaling2: { value: [1.0, 1.0, 1.0] },
    scaling3: { value: [1.0, 1.0, 1.0] },
    gridFigure: { value: [] },
    center: { value: [0.0, 0.0, 0.0] },
    offset: { value: 0.0 },
    emissive: { value: [0.0, 0.0, 0.0] },
    customColor: { value: [0.0, 0.0, 0.0] },
    lPosition: { value: [0.0, 0.0, 0.0] },
    lPosition2: { value: [0.0, 0.0, 0.0] },
    modeltype: { value: 0 },
    opac: { value: 1.0 },
    isTexture: { value: false },
    image: { value: null },
    replicaX: { value: 1.0 },
    replicaY: { value: 1.0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }
}


/////////////////////////////////////////////
THREE.UniformsLib.CutShaderNew = {
    cutNum: { type: "int", value: 0 },
    cutType: { type: "int", value: 0 },
    cutXyz: { value: [0.0, 0.0, 0.0] },
    cutRYxyz: { value: [0.0, 0.0, 0.0] },
    cutZX: { value: [0.0, 0.0, 0.0] }, //x: 位置； y: 角度； z: A、B面（1A,2B）
    gridFigure: { value: [] },
    emissive: { value: [0.0, 0.0, 0.0] },
    customColor: { value: [0.0, 0.0, 0.0] },
    lPosition: { value: [0.0, 0.0, 0.0] },
    lPosition2: { value: [0.0, 0.0, 0.0] },
    modeltype: { value: 0 },
    tNormal: {
        value: [-0.9404365560933522, 0.31287890191592627, -0.1329882577491678,
        -0.3399692397310011, -0.8654981763200149, 0.3678774562588109,
            0.00000000000000093, 0.039117732490855386, 0.09203153266556997]
    }   
}