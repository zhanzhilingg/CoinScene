
var THREE = require('./three')

const CutShader = {
    ambient: 0.2,
    LightShader: {
        newUniforms: THREE.UniformsLib[ "LightShaderNew" ],
        uniforms: THREE.UniformsLib[ "LightShader" ],
        vertexshader:  THREE.ShaderChunk[ "LightShaderNew" ],
        fragmentshader: THREE.ShaderChunk[ "LightShader" ]
    },

    //模型折线剖切
    CutShader1: function (points, direction) {

        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);

        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        //points = sortPoints(points, min[0]);

        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "CutShader1" ],
            {
                "points": { value: points },
                "pmin": {
                    type: "v2", value: min
                },
                "pmax": {
                    type: "v2", value: max
                }
            }
        ]);
        obj.vertexShader = [
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader1_ver" ],
        ].join("\n");
        obj.fragmentShader = [
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            THREE.ShaderChunk[ "CutShader1_frag" ],
        ].join("\n");

        return obj;
    },

    //模型旋转折线剖切
    CutShader2: function (points) {
        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);

        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        //points = sortPoints(points, min[0]);

        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "CutShader2" ],
            {
                ambient: { value: CutShader.ambient },
                "points": { value: points  },
                "pmin": { type: "v2", value: min },
                "pmax": { type: "v2", value: max },
            }
        ]);
        obj.vertexShader = [
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader2_ver" ],
        ].join("\n");
        obj.fragmentShader = [
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            THREE.ShaderChunk[ "CutShader2_frag" ],
        ].join("\n");

        return obj;
    },

    //基坑开挖
    //模型折线剖切
    CutShader3: function (points, direction) {

        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);

        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        //points = sortPoints(points, min[0]);

        var obj = new Object();
        obj.uniforms =  THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "CutShader3" ],
            {
            "points": { value: points },
            "pmin": {
                type: "v2", value: min
            },
            "pmax": {
                type: "v2", value: max
            },
            ambient: { value: CutShader.ambient },

        }]);
        obj.vertexShader = [
            "precision mediump float;",
            "precision highp int;",
            "uniform vec3 color;",
            "uniform vec3 pmax;",
            "uniform vec3 pmin;",
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader3_ver" ],
        ].join("\n");
        obj.fragmentShader = [

            "precision mediump float;",
        "precision highp int;",
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            THREE.ShaderChunk[ "CutShader3_frag" ],
        ].join("\n");

        return obj;
    },

    //基坑开挖
    //模型折线剖切
    CutShader3_1: function (points, direction) {

        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);

        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        //points = sortPoints(points, min[0]);

        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib[ "CutShader3_1" ],
            {
            "points": { value: points },
            "pmin": { type: "v2", value: min },
            "pmax": { type: "v2", value: max },
        }]);
        obj.vertexShader = [
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader3_1_ver" ],
        ].join("\n");
        obj.fragmentShader = [
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            THREE.ShaderChunk[ "CutShader3_1_frag" ],
        ].join("\n");

        return obj;
    },

    //隧道挖空
    CutShader4: function (points, rs) {

        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];
        var radius = rs.toFixed(1);

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);


        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        points = sortPoints(points, min[0]);
        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([
            {
                "points": { value: points },
                "min": {  type: "v2", value: min },
                "max": {  type: "v2", value: max },
            },
            THREE.UniformsLib[ "CutShader4" ]
        ]);
        obj.vertexShader = [
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader4_ver" ]
        ].join("\n");
        obj.fragmentShader = [
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            "const float radius=" + radius + ";",
            THREE.ShaderChunk[ "CutShader4_frag" ]
        ].join("\n");
        return obj;
    },

    //模型旋转隧道挖空
    CutShader5: function (points, rs) {

        var pCount = points.length / 3;

        var max = [0, 0, 0];
        var min = [0, 0, 0];
        var radius = rs.toFixed(1);

        for (var k = 0; k < pCount; k++) {
            if (k == 0) {
                max = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
                min = [points[k * 3], points[k * 3 + 1], points[k * 3 + 2]];
            }
            else {
                max[0] = Math.max(max[0], points[k * 3]);
                max[1] = Math.max(max[1], points[k * 3 + 1]);
                max[2] = Math.max(max[2], points[k * 3 + 2]);

                min[0] = Math.min(min[0], points[k * 3]);
                min[1] = Math.min(min[1], points[k * 3 + 1]);
                min[2] = Math.min(min[2], points[k * 3 + 2]);
            }
        }

        max[0] = max[0].toFixed(1);
        max[1] = max[1].toFixed(1);
        max[2] = max[2].toFixed(1);

        min[0] = min[0].toFixed(1);
        min[1] = min[1].toFixed(1);
        min[2] = min[2].toFixed(1);


        function sortPoints(ps, m) {
            var b = [];
            var a = [];
            var f = [];
            var isok = false;
            var pCount = ps.length / 3;
            for (var l = 0; l < pCount - 1; l++) {
                if (isok) {
                    b.push(ps[l * 3]);
                    b.push(ps[l * 3 + 1]);
                    b.push(ps[l * 3 + 2]);

                }
                else {
                    if (ps[l * 3].toFixed(1) == m) {
                        isok = true;

                        f.push(ps[l * 3]);
                        f.push(ps[l * 3 + 1]);
                        f.push(ps[l * 3 + 2]);
                        b = b.concat(f);
                    }
                    else {
                        a.push(ps[l * 3]);
                        a.push(ps[l * 3 + 1]);
                        a.push(ps[l * 3 + 2]);
                    }
                }
            }
            b = b.concat(a);
            b = b.concat(f);

            return b;
        }

        points = sortPoints(points, min[0]);
        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([
            {
                "points": {  value: points },
                "min": { type: "v2", value: min },
                "max": {  type: "v2", value: max }
            },
            THREE.UniformsLib[ "CutShader5" ]
        ])
        obj.vertexShader = [
            "uniform float points[" + points.length + "];",
            THREE.ShaderChunk[ "CutShader5_ver" ]
        ].join("\n");
        obj.fragmentShader = [
            "uniform float points[" + points.length + "];",
            "const int pointCount=" + pCount + ";",
            "const float radius=" + radius + ";",
            THREE.ShaderChunk[ "CutShader5_frag" ]
        ].join("\n");
        return obj;
    },

    CutShader6: function (count1, count2) {
        // debugger;
        var gridFigureCount = 3;
        if (count1 != undefined && count1 > 3) {
            gridFigureCount = count1;
        }
        var centerPointCount = 3;
        if (count2 != undefined && count2 > 3) {
            centerPointCount = count2;
        }

        var obj = new Object();

        obj.uniforms = THREE.UniformsUtils.merge([{
                ambient: { value: CutShader.ambient },
                gridFigureCount: { value: gridFigureCount },
                centerPointCount: { value: centerPointCount },
            },
            THREE.UniformsLib[ "CutShader6" ]
        ]);

        obj.vertexShader = [
            THREE.ShaderChunk[ "CutShader6_ver" ]
        ].join("\n");

        obj.fragmentShader = [
            `uniform float gridFigure[`+ gridFigureCount + `];`,
            `const int gridFigureCount=` + gridFigureCount / 3 + `;`,
            `uniform float centerPoint[`+ centerPointCount + `];`,
            `const int centerPointCount=` + centerPointCount / 3 + `;`,
            THREE.ShaderChunk[ "CutShader6_frag" ]
        ].join("\n");

        return obj;
    },

    CutShader7: function (count1, count2) {
        var gridFigureCount = 3;
        if (count1 != undefined && count1 > 3) {
            gridFigureCount = count1;
        }
        var centerPointCount = 3;
        if (count2 != undefined && count2 > 3) {
            centerPointCount = count2;
        }

        var obj = new Object();

        obj.uniforms = THREE.UniformsUtils.merge([{
                gridFigureCount: { value: gridFigureCount },
                centerPointCount: { value: centerPointCount },
            },
            THREE.UniformsLib[ "CutShader7" ]
        ]);

        obj.vertexShader = [
            THREE.ShaderChunk[ "CutShader7_ver" ]
        ].join("\n");

        obj.fragmentShader = [
            `uniform float gridFigure[`+ gridFigureCount + `];`,
            `const int gridFigureCount=` + gridFigureCount / 3,
            `uniform float centerPoint[`+ centerPointCount + `];`,
            `const int centerPointCount=` + centerPointCount / 3,
            THREE.ShaderChunk[ "CutShader7_frag" ]
        ].join("\n");

        return obj;
    },

    CutShader8: function (count1, count2) {
        var gridFigureCount = 3;
        if (count1 != undefined && count1 > 3) {
            gridFigureCount = count1;
        }
        var obj = new Object();

        obj.uniforms = THREE.UniformsUtils.merge([{
                ambient: { value: CutShader.ambient },
                gridFigureCount: { value: gridFigureCount },
            },
            THREE.UniformsLib[ "CutShader8" ]
        ]);


        obj.vertexShader = [
            THREE.ShaderChunk[ "CutShader8_ver" ]
        ].join("\n");

        obj.fragmentShader = [
            `uniform int cutRYNum[`+ gridFigureCount / 3+`];`,
            `uniform float cutRYxyz[`+ gridFigureCount+`];`,
            `uniform float gridFigure[`+ gridFigureCount + `];`,
            `const int gridFigureCount=` + gridFigureCount / 3 + `;`,
            THREE.ShaderChunk[ "CutShader8_frag" ]
        ].join("\n");

        return obj;
    },


    CutShader9: function (count1, count2) {
        var gridFigureCount = 3;
        if (count1 != undefined && count1 > 3) {
            gridFigureCount = count1;
        }
        var obj = new Object();

        obj.uniforms = THREE.UniformsUtils.merge([{
                gridFigureCount: { value: gridFigureCount },
            },
            THREE.UniformsLib[ "CutShader9" ]
        ]);


        obj.vertexShader = [
            THREE.ShaderChunk[ "CutShader9_ver" ]
        ].join("\n");

        obj.fragmentShader = [
            ` uniform int cutRYNum[`+ gridFigureCount / 3 + `];`,
            `uniform float cutRYxyz[`+ gridFigureCount + `];`,
            `uniform float gridFigure[`+ gridFigureCount + `];`,
            `const int gridFigureCount=` + gridFigureCount / 3 + `;`,
            THREE.ShaderChunk[ "CutShader9_frag" ]
        ].join("\n");

        return obj;
    },

    CutShaderNew: function (count) {
        var gridFigureCount = 4;
        if (count != undefined && count > 4) {
            gridFigureCount = count;
        }
        var obj = new Object();
        obj.uniforms = THREE.UniformsUtils.merge([{
                gridFigureCount: { value: gridFigureCount },
            },
            THREE.UniformsLib[ "CutShaderNew" ]
        ]);

        obj.vertexShader = [
            THREE.ShaderChunk[ "CutShaderNew_ver" ]
        ].join("\n");

        obj.fragmentShader = [
            THREE.ShaderChunk[ "CutShaderNew_frag" ]
        ].join("\n");

        return obj;
    },

    ModelShader: function (options) {

        function defaultValue (value, dValue) {
            return (value === undefined || value === null) ? dValue : value;
        }
        // debugger;

        options = defaultValue(options, {});
        var cutPolygonEnable = defaultValue(options.cutPolygonEnable, false);
        var cutPolygonPoints = defaultValue(options.cutPolygonPoints, []);
        var cutPolygonSide = defaultValue(options.cutPolygonSide, true);
        var cutAxialEnable = defaultValue(options.cutAxialEnable, true);
        var cutAxialXYZ = defaultValue(options.cutAxialXYZ, 0);
        var cutAxialDistance = defaultValue(options.cutAxialDistance, 0);
        var cutAxialAngle = defaultValue(options.cutAxialAngle, 359 * Math.PI / 180);


        var obj = new Object();
        obj.uniforms = {
            cutPolygonEnable: { value: cutPolygonEnable },
            cutPolygonPoints: { value: cutPolygonPoints },
            cutPolygonSide: { value: cutPolygonSide },
            cutAxialEnable: { value: cutAxialEnable },
            cutAxialXYZ: { value: cutAxialXYZ },
            cutAxialDistance: { value: cutAxialDistance },
            cutAxialAngle: { value: cutAxialAngle },
        };
        obj.vertexShader =  THREE.ShaderChunk[ "CutShaderNew_ver" ]

        obj.fragmentShader = [
            ` #define M_PI ${Math.PI}\n `,
            THREE.ShaderChunk[ "ModelShader_frag" ]
        ]
        return obj
    },
    
    myShader: function() {
        return {

            uniforms: THREE.UniformsUtils.merge( [
                THREE.UniformsLib[ "common" ],
                THREE.UniformsLib[ "fog" ],
                THREE.UniformsLib[ "lights" ],
                THREE.UniformsLib[ "shadowmap" ],
                {
                    "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
                    "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
                    "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
                }
            ]),
            
            vertexShader: [
            
                "#define LAMBERT",
            
                "varying vec3 vLightFront;",
            
                "#ifdef DOUBLE_SIDED",
            
                    "varying vec3 vLightBack;",
            
                "#endif",
            
                THREE.ShaderChunk[ "map_pars_vertex" ],
                THREE.ShaderChunk[ "lightmap_pars_vertex" ],
                THREE.ShaderChunk[ "envmap_pars_vertex" ],
                THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
                THREE.ShaderChunk[ "color_pars_vertex" ],
                THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
                THREE.ShaderChunk[ "skinning_pars_vertex" ],
                THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
            
                "void main() {",
            
                    THREE.ShaderChunk[ "map_vertex" ],
                    THREE.ShaderChunk[ "lightmap_vertex" ],
                    THREE.ShaderChunk[ "color_vertex" ],
            
                    THREE.ShaderChunk[ "morphnormal_vertex" ],
                    THREE.ShaderChunk[ "skinbase_vertex" ],
                    THREE.ShaderChunk[ "skinnormal_vertex" ],
                    THREE.ShaderChunk[ "defaultnormal_vertex" ],
            
                    THREE.ShaderChunk[ "morphtarget_vertex" ],
                    THREE.ShaderChunk[ "skinning_vertex" ],
                    THREE.ShaderChunk[ "default_vertex" ],
            
                    THREE.ShaderChunk[ "worldpos_vertex" ],
                    THREE.ShaderChunk[ "envmap_vertex" ],
                    THREE.ShaderChunk[ "lights_lambert_vertex" ],
                    THREE.ShaderChunk[ "shadowmap_vertex" ],
            
                "}"
            
            ].join("\n"),
            
            fragmentShader: [
            
                "uniform float opacity;",
            
                "varying vec3 vLightFront;",
            
                "#ifdef DOUBLE_SIDED",
            
                    "varying vec3 vLightBack;",
            
                "#endif",
            
                THREE.ShaderChunk[ "color_pars_fragment" ],
                THREE.ShaderChunk[ "map_pars_fragment" ],
                THREE.ShaderChunk[ "lightmap_pars_fragment" ],
                THREE.ShaderChunk[ "envmap_pars_fragment" ],
                THREE.ShaderChunk[ "fog_pars_fragment" ],
                THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
                THREE.ShaderChunk[ "specularmap_pars_fragment" ],
            
            
            
                "void main() {",
            
                    "gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
            
                    THREE.ShaderChunk[ "map_fragment" ],
                    THREE.ShaderChunk[ "alphatest_fragment" ],
                    THREE.ShaderChunk[ "specularmap_fragment" ],
            
                    "#ifdef DOUBLE_SIDED",
            
                        //"float isFront = float( gl_FrontFacing );",
                        //"gl_FragColor.xyz *= isFront * vLightFront + ( 1.0 - isFront ) * vLightBack;",
            
                        "if ( gl_FrontFacing )",
                            "gl_FragColor.xyz *= vLightFront;",
                        "else",
                            "gl_FragColor.xyz *= vLightBack;",
            
                    "#else",
            
                        "gl_FragColor.xyz *= vLightFront;",
            
                    "#endif",
            
                    THREE.ShaderChunk[ "lightmap_fragment" ],
                    THREE.ShaderChunk[ "color_fragment" ],
                    THREE.ShaderChunk[ "envmap_fragment" ],
                    THREE.ShaderChunk[ "shadowmap_fragment" ],
            
                    THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
            
                    THREE.ShaderChunk[ "fog_fragment" ],
            
                "}"
            
            ].join("\n")
            
            }
    }
    ,
    
    standardShader: function () {
        return {

            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib["common"],
                THREE.UniformsLib["envmap"],
                THREE.UniformsLib["aomap"],
                THREE.UniformsLib["lightmap"],
                THREE.UniformsLib["emissivemap"],
                THREE.UniformsLib["bumpmap"],
                THREE.UniformsLib["normalmap"],
                THREE.UniformsLib["displacementmap"],
                THREE.UniformsLib["roughnessmap"],
                THREE.UniformsLib["metalnessmap"],
                THREE.UniformsLib["fog"],
                THREE.UniformsLib["lights"],
                {
                    emissive: { value: new Color(0x000000) },
                    roughness: { value: 1.0 },
                    metalness: { value: 0.0 },
                    envMapIntensity: { value: 1 } // temporary
                }
            ]),

            vertexShader: [
                
                "#define STANDARD",

                "varying vec3 vViewPosition;",
                "varying vec3 vNormal;",
                "varying vec3 vTangent;",
                "varying vec3 vBitangent;",

                THREE.ShaderChunk["common"],
                THREE.ShaderChunk["uv_pars_vertex"],
                THREE.ShaderChunk["uv2_pars_vertex"],
                THREE.ShaderChunk["displacementmap_pars_vertex"],
                THREE.ShaderChunk["color_pars_vertex"],
                THREE.ShaderChunk["fog_pars_vertex"],
                THREE.ShaderChunk["morphtarget_pars_vertex"],
                THREE.ShaderChunk["skinning_pars_vertex"],
                THREE.ShaderChunk["shadowmap_pars_vertex"],
                THREE.ShaderChunk["logdepthbuf_pars_vertex"],
                THREE.ShaderChunk["clipping_planes_pars_vertex"],

                "void main() {",

                THREE.ShaderChunk["uv_vertex"],
                THREE.ShaderChunk["uv2_vertex"],
                THREE.ShaderChunk["color_vertex"],

                THREE.ShaderChunk["beginnormal_vertex"],
                THREE.ShaderChunk["morphnormal_vertex"],
                THREE.ShaderChunk["skinbase_vertex"],
                THREE.ShaderChunk["skinnormal_vertex"],
                THREE.ShaderChunk["defaultnormal_vertex"],

                "vNormal = normalize( transformedNormal );",
                "vTangent = normalize( transformedTangent );",
                "vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );",

                THREE.ShaderChunk["begin_vertex"],
                THREE.ShaderChunk["morphtarget_vertex"],
                THREE.ShaderChunk["skinning_vertex"],
                THREE.ShaderChunk["displacementmap_vertex"],
                THREE.ShaderChunk["project_vertex"],
                THREE.ShaderChunk["logdepthbuf_vertex"],
                THREE.ShaderChunk["clipping_planes_vertex"],

                "vViewPosition = - mvPosition.xyz;",

                THREE.ShaderChunk["worldpos_vertex"],
                THREE.ShaderChunk["shadowmap_vertex"],
                THREE.ShaderChunk["fog_vertex"],

                "}"

            ].join("\n"),

            fragmentShader: [
                `
                #define STANDARD
	            #define REFLECTIVITY
	            #define CLEARCOAT
	            #define TRANSMISSION
                uniform vec3 diffuse;
                uniform vec3 emissive;
                uniform float roughness;
                uniform float metalness;
                uniform float opacity;
	            uniform float transmission;
	            uniform float reflectivity;
	            uniform float clearcoat;
	            uniform float clearcoatRoughness;
	            uniform vec3 sheen;
                varying vec3 vViewPosition;
	            varying vec3 vNormal;
		        varying vec3 vTangent;
		        varying vec3 vBitangent;
                `,

                THREE.ShaderChunk["common"],
                THREE.ShaderChunk["packing"],
                THREE.ShaderChunk["dithering_pars_fragment"],
                THREE.ShaderChunk["color_pars_fragment"],
                THREE.ShaderChunk["uv_pars_fragment"],
                THREE.ShaderChunk["uv2_pars_fragment"],
                THREE.ShaderChunk["map_pars_fragment"],
                THREE.ShaderChunk["alphamap_pars_fragment"],
                THREE.ShaderChunk["aomap_pars_fragment"],
                THREE.ShaderChunk["lightmap_pars_fragment"],
                THREE.ShaderChunk["emissivemap_pars_fragment"],
                THREE.ShaderChunk["transmissionmap_pars_fragment"],
                THREE.ShaderChunk["bsdfs"],
                THREE.ShaderChunk["cube_uv_reflection_fragment"],
                THREE.ShaderChunk["envmap_common_pars_fragment"],
                THREE.ShaderChunk["envmap_physical_pars_fragment"],
                THREE.ShaderChunk["fog_pars_fragment"],
                THREE.ShaderChunk["lights_pars_begin"],
                THREE.ShaderChunk["lights_physical_pars_fragment"],
                THREE.ShaderChunk["shadowmap_pars_fragment"],
                THREE.ShaderChunk["bumpmap_pars_fragment"],
                THREE.ShaderChunk["normalmap_pars_fragment"],
                THREE.ShaderChunk["clearcoat_pars_fragment"],
                THREE.ShaderChunk["roughnessmap_pars_fragment"],
                THREE.ShaderChunk["metalnessmap_pars_fragment"],
                THREE.ShaderChunk["logdepthbuf_pars_fragment"],
                THREE.ShaderChunk["clipping_planes_pars_fragment"],


                "void main() {",

                THREE.ShaderChunk["clipping_planes_fragment"],

                `vec4 diffuseColor = vec4( diffuse, opacity );
	            ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
                vec3 totalEmissiveRadiance = emissive;
                float totalTransmission = transmission;
                `,

                THREE.ShaderChunk["logdepthbuf_fragment"],
                THREE.ShaderChunk["map_fragment"],
                THREE.ShaderChunk["color_fragment"],
                THREE.ShaderChunk["alphamap_fragment"],
                THREE.ShaderChunk["alphatest_fragment"],
                THREE.ShaderChunk["roughnessmap_fragment"],
                THREE.ShaderChunk["metalnessmap_fragment"],
                THREE.ShaderChunk["normal_fragment_begin"],
                THREE.ShaderChunk["normal_fragment_maps"],
                THREE.ShaderChunk["clearcoat_normal_fragment_begin"],
                THREE.ShaderChunk["clearcoat_normal_fragment_maps"],
                THREE.ShaderChunk["emissivemap_fragment"],
                THREE.ShaderChunk["transmissionmap_fragment"],

                THREE.ShaderChunk["lights_physical_fragment"],
                THREE.ShaderChunk["lights_fragment_begin"],
                THREE.ShaderChunk["lights_fragment_maps"],
                THREE.ShaderChunk["lights_fragment_end"],
                THREE.ShaderChunk["aomap_fragment"],

                `
	            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
		        diffuseColor.a *= mix( saturate( 1. - totalTransmission + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) ), 1.0, metalness );
	            gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                `,

                THREE.ShaderChunk["tonemapping_fragment"],
                THREE.ShaderChunk["encodings_fragment"],
                THREE.ShaderChunk["fog_fragment"],
                THREE.ShaderChunk["premultiplied_alpha_fragment"],

                THREE.ShaderChunk["dithering_fragment"],

                "}"

            ].join("\n")

        }
    }
}

module.exports = CutShader;
