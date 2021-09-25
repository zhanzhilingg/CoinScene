
var THREE = require('./three')

//
THREE.ShaderChunk.LightShaderNew = `
    uniform float amplitude;
    uniform float time;
    uniform mat3  tNormal;

    uniform vec3 customColor;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon;

    void main() {
        vNormal = normalize(tNormal * normal);
        vColor = customColor;
        vPositon = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`
THREE.ShaderChunk.LightShader = `
    uniform float time;
    uniform mat3  tNormal;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon;

    void main() {
        const float ambient = 1.0;
        const float distinct = 100.0;
        vec3 directColor = vec3(0.7529411764705882,0.7529411764705882,0.5647058823529412);

        vec3 light = normalize(lPosition * distinct - vPositon);
        vec3 light2 = normalize( lPosition2 * distinct - vPositon);

        float directional = max( dot( vNormal, light ), 0.0 );
        float directional2 = max( dot( vNormal, light2 ), 0.0 );
        float shade = (3.0 * pow ( abs ( vNormal.z ), 2.0 )+ 2.0 * pow ( abs ( vNormal.y ), 2.0 )+ 1.0 * pow ( abs ( vNormal.x ), 2.0 ) ) / 3.0;

        gl_FragColor = vec4(vColor * shade * 0.5, 1.0) * ambient+  vec4(vColor, 1.0)* (directional * vec4(directColor, 1.0) + directional2 * vec4(directColor,1.0));
    }`


//
THREE.ShaderChunk.CutShader1_ver = `
    precision mediump float;
    precision highp int;
    uniform vec3 color;
    uniform vec3 pmax;
    uniform vec3 pmin;

    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal;
    uniform float amplitude;
    uniform float time;
    uniform float depth;
    uniform int type;
    uniform mat3  tNormal;

    uniform vec3 customColor;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon;

    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    worldPosition = position;
    pixelNormal = normal;
    const float r = 0.85;
    const float g = 0.96;
    const float b = 1.0;
    vNormal = normalize(tNormal * normal);
    vColor = vec3(customColor.r*r,customColor.g*g,customColor.b*b);
    vPositon = position;
    }
`
THREE.ShaderChunk.CutShader1_frag =  `
        varying vec2 vUv;
        uniform vec3 color;
        const int points_ln=3;
        varying vec3 worldPosition;
        varying vec3 pixelNormal; 
        uniform float time;
        uniform float opac;
        uniform sampler2D image;
        uniform bool isTexture;
        precision mediump float;
        precision highp int;
        uniform sampler2D tDiffuse;
        uniform vec3 pmax;
        uniform vec3 pmin;

        uniform float replicaX;
        uniform float replicaY;
        uniform mat3  tNormal;
        uniform vec3 lPosition;
        uniform vec3 lPosition2;
        varying vec3 vNormal;
        varying vec3 vColor;
        uniform float depth;
        uniform int type;
        varying vec3 vPositon;

        bool contains(vec3 p) {
        int crossings = 0;
        for(int i=0;i< pointCount ;i++){
        float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
        bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
        bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
        bool above= ( p.z < slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
        if ((cond1 || cond2) && above) { crossings++; }
        }
        float v= float(crossings) / float(2);
        return !(floor(v)==ceil(v));
        }
        bool pnpoly(vec3 p){
        bool c = false;
        for(int i=0;i< pointCount ;i++){
        if(i>0){
        if ( ((points[i*points_ln+2]> p.z)!=(points[(i-1)*points_ln+2]> p.z)) && (p.x < (points[(i-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(i-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
        c = !c;
        }
        } else {
        if (((points[i*points_ln+2]> p.z)!=(points[(pointCount-1)*points_ln+2]> p.z))&&(p.x < (points[(pointCount-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(pointCount-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
        c = !c;
        }
        }
        }
        return c;
        }

        void main() {

        vec2 p = vUv;

        if (worldPosition.x > pmax.x || worldPosition.x <pmin.x || worldPosition.z < pmin.z || worldPosition.z > pmax.z){",
        discard;
        }
        else{ 
        if (pnpoly(worldPosition)) {

        const float ambient = 0.3;
        vec3 directColor = vec3(0.75294,0.75294,0.56470);
        vec3 ambientColor = vec3(0.12156,0.12156,0.12941);

        vec3 light = normalize(lPosition * 100.0- vPositon);
        vec3 light2 = normalize( lPosition2 * 100.0-vPositon);

        float directional = max( dot( vNormal, light ), 0.0 );
        float directional2 = max( dot( vNormal, light2 ), 0.0 );

                vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
                vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

                a.a=1.0;
                d.a=1.0;
                vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
                vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
                if (isTexture) {

                    vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )+(  a+d);
                    c.a = opac;
                    if(replicaX == 1.0 && replicaY ==1.0 )
                    {
                        gl_FragColor = texture2D(image,vec2(vUv.x,vUv.y));
                    }else{
                        gl_FragColor = c;
                    }
                }else
                {
                    vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2);
                    c.a = opac;
                    gl_FragColor = c;
                }

        }else{discard;}
        }

    }
`


//
THREE.ShaderChunk.CutShader2_ver = `

precision mediump float;
precision highp int;
uniform vec3 color;
uniform vec3 pmax;
uniform vec3 pmin;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal; 
uniform float amplitude;
uniform float time;
uniform mat3  tNormal;

uniform vec3 customColor;
uniform vec3 lPosition;
uniform vec3 lPosition2;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
worldPosition = position;
pixelNormal = normal;
const float r = 0.85;
const float g = 0.96;
const float b = 1.0;
vNormal = normalize(tNormal * normal);
vColor = vec3(customColor.r*r,customColor.g*g,customColor.b*b);
vPositon = position;
}
`
THREE.ShaderChunk.CutShader2_frag = `
precision mediump float;
precision highp int;
uniform sampler2D tDiffuse;
uniform vec3 pmax;
uniform vec3 pmin;
uniform vec3 color;
uniform float ambient;
const int points_ln=3;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal; 
 uniform float time;
uniform float opac;
uniform sampler2D image;
uniform bool isTexture;

uniform float replicaX;
uniform float replicaY;
uniform vec3 scale;

uniform mat3  tNormal;
uniform vec3 lPosition;
uniform vec3 lPosition2;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon; 

bool contains(vec3 p) {
int crossings = 0;
for(int i=0;i< pointCount ;i++){
float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
bool above= ( p.y < slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
if ((cond1 || cond2) && above) { crossings++; }
}
float v= float(crossings) / float(2);
return !(floor(v)==ceil(v));
}

bool pnpoly(vec3 p){
bool c = false;
// "int j = 0;",
for(int i=0;i< pointCount ;i++){
if(i>0){
//if (((points[i*points_ln]  > p.z) != (points[j*points_ln+2] > p.z)) &&(p.x < (points[j*points_ln+2] - points[i*points_ln]) * (p.z - points[i*points_ln] ) / (points[j*points_ln+2] - points[i*points_ln] ) + points[i*points_ln] )) {
if ( ((points[i*points_ln+2]> p.z)!=(points[(i-1)*points_ln+2]> p.z)) && (p.x < (points[(i-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(i-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
c = !c;
}
} else {
if (((points[i*points_ln+2]> p.z)!=(points[(pointCount-1)*points_ln+2]> p.z))&&(p.x < (points[(pointCount-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(pointCount-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
c = !c;
}
}
}
return c;
}

void main() {

vec2 p = vUv;

if (worldPosition.x > pmax.x || worldPosition.x <pmin.x || worldPosition.z < pmin.z || worldPosition.z > pmax.z){
discard;
}
else{ 
if (pnpoly(worldPosition)) {

    //"float shade = (3.0 * pow ( abs ( pixelNormal.z ), 2.0 )+ 2.0 * pow ( abs ( pixelNormal.y ), 2.0 )+ 1.0 * pow ( abs ( pixelNormal.x ), 2.0 ) ) / 3.0;",
    //"gl_FragColor = vec4(color*shade,1.0);
    //         const float ambient = 1.0;
    //        vec3 directColor = vec3(0.75294,0.75294,0.56470);
    //        vec3 ambientColor = vec3(0.12156,0.12156,0.12941);

    //        vec3 light = normalize(lPosition * 100.0- vPositon);
    //        vec3 light2 = normalize( lPosition2 * 100.0-vPositon);

    //        float directional = max( dot( vNormal, light ), 0.0 );
    //        float directional2 = max( dot( vNormal, light2 ), 0.0 );
    //        float shade = (3.0 * pow ( abs ( vNormal.z ), 2.0 )+ 2.0 * pow ( abs ( vNormal.y ), 2.0 )+ 1.0 * pow ( abs ( vNormal.x ), 2.0 ) ) / 3.0;

    //        gl_FragColor = vec4(vColor*shade,1.0)*0.5+ vec4(vColor,1.0)*vec4(ambientColor,1.0)*ambient+  vec4(vColor,1.0)* (directional * vec4(directColor,1.0) + directional2 * vec4(directColor,1.0));
    //
    vec3 directColor = vec3(1.0, 1.0, 1.0);
    // vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
    vec3 ambientColor = vec3(1.0, 1.0, 1.0);

    vec3 light = normalize(lPosition);
    vec3 light2 = normalize(lPosition2);

    vec2 aNormal = vec2(0.0,0.0);

    float directional = 0.0;
    float directional2 = 0.0;

    directional = max(dot(vNormal, light), 0.0);
    directional2 = max(dot(vNormal, light2), 0.0);


        vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

        a.a=1.0;
        d.a=1.0;
        vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
        vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
        if (isTexture) {



            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.1+(  a+d);
            c.a = opac;


            if(replicaX == 1.0 && replicaY ==1.0 )
            {
                
                vec4 logo = texture2D(image,vec2(vUv.x, 1.0 - vUv.y));

                gl_FragColor = vec4(logo.rgb, opac);

                
            }else{

                vec4 logo = texture2D(image,vec2(fract(vUv.x * 100.0),fract(vUv.y * 100.0)));
                if (vNormal.x > 0.5 || vNormal.x < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * 80.0),fract(vUv.y * 20.0 * scale.y)));
                }
                else if (vNormal.z > 0.5 || vNormal.z < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * 80.0),fract(vUv.y * 20.0 * scale.y)));
                }
                gl_FragColor = vec4(logo.rgb, opac);
            }

            // if(replicaX == 1.0 && replicaY ==1.0 )
            // {
            //     gl_FragColor = texture2D(image,vec2(vUv.x, 1.0 - vUv.y));
            // }else{
            //     gl_FragColor = c;
            // }
        }else
        {
            // vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2)*0.25;
            // c.a = opac;
            // gl_FragColor = c;
            
            vec4 a1 = directional * vec4(directColor, 1.0);
            vec4 a2 = directional2 * vec4(directColor, 1.0);
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2 )*0.5;
            gl_FragColor = c;
        }
        // if (isTexture) {

        //     vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.1+(  a+d);
        //     c.a = opac;
        //     if(replicaX == 1.0 && replicaY ==1.0 )
        //     {
        //         gl_FragColor = texture2D(image,vec2(vUv.x,vUv.y));
        //     }else{
        //         gl_FragColor = c;
        //     }
        // }else
        // {
        //     vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2)*0.25;
        //     c.a = opac;
        //     gl_FragColor = c;
        // }
    
}else{discard;}
}

}
`


//
THREE.ShaderChunk.CutShader3_ver = `
    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal; 
    uniform float amplitude;
    uniform float time;
    uniform float depth;
    uniform int type;
    uniform mat3  tNormal;

    uniform vec3 customColor;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon; 

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        worldPosition = position;
        pixelNormal = normal;
        const float r = 0.85;
        const float g = 0.96;
        const float b = 1.0;
        vNormal = normalize(tNormal * normal);
        vColor = vec3(customColor.r*r,customColor.g*g,customColor.b*b);
        vPositon = position;
    }
`
THREE.ShaderChunk.CutShader3_frag = `
    uniform sampler2D tDiffuse;
    uniform vec3 pmax;
    uniform vec3 pmin;
    uniform vec3 color;
    uniform float ambient;
    const int points_ln=3;
    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal; 
    uniform float time;
    uniform mat3  tNormal;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;
    varying vec3 vNormal;
    varying vec3 vColor;
    uniform float depth;
    uniform int type;
    varying vec3 vPositon;
    uniform vec3 center;

    uniform float opac;
    uniform sampler2D image;
    uniform bool isTexture;

    uniform float replicaX;
    uniform float replicaY;
    uniform vec3 scale;

    bool contains(vec3 p) {
    int crossings = 0;
    for(int i=0;i< pointCount ;i++){
    float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
    bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
    bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
    bool above= ( p.z < slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
    if ((cond1 || cond2) && above) { crossings++; }
    }
    float v= float(crossings) / float(2);
    return !(floor(v)==ceil(v));
    }

    bool pnpoly(vec3 p){
    bool c = false;
    for(int i=0;i< pointCount ;i++){
    if(i>0){
    if ( ((points[i*points_ln+2]> p.z)!=(points[(i-1)*points_ln+2]> p.z)) && (p.x < (points[(i-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(i-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
    c = !c;
    }
    } else {
    if (((points[i*points_ln+2]> p.z)!=(points[(pointCount-1)*points_ln+2]> p.z))&&(p.x < (points[(pointCount-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(pointCount-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
    c = !c;
    }
    }
    }
    return c;
    }
    void main() {
    vec2 p = vUv;
    if (type == 1 && pnpoly(worldPosition)&& worldPosition.y>depth-center.y) {

        discard;

    }
    else if (type == 2 && !(pnpoly(worldPosition)&& worldPosition.y>depth-center.y)) {
        discard;
    }
    else
    {
    vec3 directColor = vec3(1.0, 1.0, 1.0);
    // vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
    vec3 ambientColor = vec3(1.0, 1.0, 1.0);

        vec3 light = normalize(lPosition );
        vec3 light2 = normalize( lPosition2 );

        // float directional = max( dot( vNormal, light ), 0.0 );
        // float directional2 = max( dot( vNormal, light2 ), 0.0 );

        float directional = 0.0;
        float directional2 = 0.0;

        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);

        vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

        a.a=1.0;
        d.a=1.0;

        vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
        vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
        if (isTexture) {

            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.1+(  a+d);
            c.a = opac;


            if(replicaX == 1.0 && replicaY ==1.0 )
            {
                
                vec4 logo = texture2D(image,vec2(vUv.x, 1.0 - vUv.y));

                gl_FragColor = vec4(logo.rgb, opac);

            }else{

                vec4 logo = texture2D(image,vec2(fract(vUv.x * 100.0),fract(vUv.y * 100.0)));
                if (vNormal.x > 0.5 || vNormal.x < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * 300.0),fract(vUv.y * 30.0 * scale.y * 5.0)));
                }
                else if (vNormal.z > 0.5 || vNormal.z < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * 300.0),fract(vUv.y * 30.0 * scale.y * 5.0)));
                }
                gl_FragColor = vec4(logo.rgb, opac);
            }

        }else
        {
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2)*0.25;
            c.a = opac;
            gl_FragColor = c;
        }


    }}
`


//
THREE.ShaderChunk.CutShader3_1_ver = `
    precision mediump float;
    precision highp int;
    uniform vec3 color;
    uniform vec3 pmax;
    uniform vec3 pmin;
    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal; 
    uniform float amplitude;
    uniform float time;
    uniform float depth;
    uniform int type;
    uniform mat3  tNormal;

    uniform vec3 customColor;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon; 

    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    worldPosition = position;
    pixelNormal = normal;
    const float r = 0.85;
    const float g = 0.96;
    const float b = 1.0;
    vNormal = normalize(tNormal * normal);
    vColor = vec3(customColor.r*r,customColor.g*g,customColor.b*b);
    vPositon = position;
    }
`
THREE.ShaderChunk.CutShader3_1_frag = `
    precision mediump float;
    precision highp int;
    uniform sampler2D tDiffuse;
    uniform vec3 pmax;
    uniform vec3 pmin;
    uniform vec3 color;
    const int points_ln=3;
    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal; 
    uniform float time;
    uniform mat3  tNormal;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;
    varying vec3 vNormal;
    varying vec3 vColor;
    uniform float depth;
    uniform int type;
    varying vec3 vPositon;


    uniform float opac;
    uniform sampler2D image;
    uniform bool isTexture;

    uniform float replicaX;
    uniform float replicaY;
    bool contains(vec3 p) {
    int crossings = 0;
    for(int i=0;i< pointCount ;i++){
    float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
    bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
    bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
    bool above= ( p.z < slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
    if ((cond1 || cond2) && above) { crossings++; }
    }
    float v= float(crossings) / float(2);
    return !(floor(v)==ceil(v));
    }

    bool pnpoly(vec3 p){
    bool c = false;
    for(int i=0;i< pointCount ;i++){
    if(i>0){
    if ( ((points[i*points_ln+2]> p.z)!=(points[(i-1)*points_ln+2]> p.z)) && (p.x < (points[(i-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(i-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
    c = !c;
    }
    } else {
    if (((points[i*points_ln+2]> p.z)!=(points[(pointCount-1)*points_ln+2]> p.z))&&(p.x < (points[(pointCount-1)*points_ln] -points[i*points_ln]) * (p.z - points[i*points_ln+2]) / (points[(pointCount-1)*points_ln+2] - points[i*points_ln+2]) +points[i*points_ln])) {
    c = !c;
    }
    }
    }
    return c;
    }

    void main() {

    vec2 p = vUv;
    if (pnpoly(worldPosition)&& worldPosition.y>depth-center.y) {

            const float ambient =  0.3;

        vec3 directColor = vec3(1.0, 1.0, 1.0);
        // vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
        vec3 ambientColor = vec3(1.0, 1.0, 1.0);

            vec3 light = normalize(lPosition);
            vec3 light2 = normalize( lPosition2 );

            // float directional = max( dot( vNormal, light ), 0.0 );
            // float directional2 = max( dot( vNormal, light2 ), 0.0 );

            float directional = 0.0;
            float directional2 = 0.0;

            directional = max(dot(vNormal, light), 0.0);
            directional2 = max(dot(vNormal, light2), 0.0);


            vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
            vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

            a.a=1.0;
            d.a=1.0;

            vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
            vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;



            if (isTexture) {

                vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )+(  a+d);
                c.a = opac;
                if(replicaX == 1.0 && replicaY ==1.0 )
                {
                    gl_FragColor = texture2D(image,vec2(vUv.x,vUv.y));
                }else{
                    gl_FragColor = c;
                }
            }else
            {
                vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2);
                c.a = opac;
                gl_FragColor = c;
            }

        }
        else
        {
            discard;
        }
    }
`


//
THREE.ShaderChunk.CutShader4_ver = `
    precision mediump float;
    precision highp int;
    uniform vec3 color;
    uniform vec3 max;
    uniform vec3 min;
    varying vec2 vUv;
    varying vec3 worldPosition;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        worldPosition = position;
    }
`
THREE.ShaderChunk.CutShader4_frag = `
    precision mediump float;
    precision highp int;
    uniform sampler2D tDiffuse;
    uniform vec3 max;
    uniform vec3 min;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 worldPosition;
    const int points_ln=3;
    bool contains(vec3 p) {
    int crossings = 0;
    for(int i=0;i< pointCount ;i++){
    float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
    bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
    bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
    bool above= ( p.z < slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
    if ((cond1 || cond2) && above) { crossings++; }
    }
    float v= float(crossings) / float(2);
    return !(floor(v)==ceil(v));
    }

    void main() {
    vec2 p = vUv;
    if (worldPosition.x < max.x && worldPosition.x >min.x && worldPosition.z > min.z && worldPosition.z < max.z && contains(worldPosition)&&worldPosition.y < max.y+radius && worldPosition.y > min.y-radius ){
    discard;
    }
    else{ 
    vec4 c = vec4(color, 1);
    gl_FragColor = c;
    }
    }
`


//
THREE.ShaderChunk.CutShader5_ver = `
    precision mediump float;
    precision highp int;
    uniform vec3 color;
    uniform vec3 max;
    uniform vec3 min;
    varying vec2 vUv;
    varying vec3 worldPosition;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        worldPosition = position;
    }
`
THREE.ShaderChunk.CutShader5_frag = `
    precision mediump float;
    precision highp int;
    uniform sampler2D tDiffuse;
    uniform vec3 max;
    uniform vec3 min;
    uniform vec3 color;
    const int points_ln=3;
    varying vec2 vUv;
    varying vec3 worldPosition;
    bool contains(vec3 p) {
    int crossings = 0;
    for(int i=0;i< pointCount ;i++){
    float slope=( points[(i+1)*points_ln+2] - points[i*points_ln+2] ) / ( points[(i+1)*points_ln] - points[i*points_ln] );
    bool cond1= ( points[i*points_ln] <= p.x ) && ( p.x < points[(i+1)*points_ln]);
    bool cond2= ( points[(i+1)*points_ln] <= p.x ) && ( p.x < points[i*points_ln]);
    bool above= ( p.y > slope * ( p.x - points[i*points_ln]) + points[i*points_ln+2]);
    if ((cond1 || cond2) && above) { crossings++; }
    }
        float v= float(crossings) / float(2);
        return !(floor(v)==ceil(v));
    }
    void main() {
    vec2 p = vUv;
    if (worldPosition.x < max.x && worldPosition.x >min.x && worldPosition.y > min.z && worldPosition.y < max.z && contains(worldPosition) &&worldPosition.z < max.y+radius && worldPosition.z > min.y-radius ){
        discard;
    }
    else{ 
        vec4 c = vec4(color, 1);
        gl_FragColor = c;
    }
    }
`


//
THREE.ShaderChunk.CutShader6_ver = `precision mediump float;
precision highp int;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

uniform mat3 tNormal;
uniform vec3 customColor;
uniform vec3 lPosition;
uniform vec3 lPosition2;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    worldPosition = position;
    pixelNormal = normal;
    const float r = 0.85;
    const float g = 0.96;
    const float b = 1.0;
    vNormal = normalize(tNormal  * normal);
    vColor = vec3(customColor.r * r, customColor.g * g, customColor.b * b);
    vPositon = position;
} `
THREE.ShaderChunk.CutShader6_frag = `
precision mediump float;
precision highp int;

uniform int cutNum;
uniform float radius;
uniform float radiusAdd;
uniform float cutHalfCircle;
uniform int cutRYNum;
uniform int cutType;
uniform vec3 cutXyz;
uniform vec3 center;
uniform float offset;
uniform vec3 cutRYxyz;
uniform vec3 cutZX;
uniform vec3 scaling1;
uniform vec3 scaling2;
uniform vec3 scaling3;
uniform vec3 scale;
uniform vec3 emissive;
uniform vec3 lPosition;
uniform vec3 lPosition2;

uniform int modeltype;
uniform float opac;
uniform sampler2D image;
uniform bool isTexture;
uniform float ambient;
uniform float replicaX;
uniform float replicaY;


varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;
//轴面切割
bool axialCut()
{
    if(cutNum == 2) {
        if(worldPosition.z > cutXyz.z) {
            return true;
        }
    }
    if (cutNum == 4) {
        if (worldPosition.y > cutXyz.y) {
            return true;
        }
    }
    // 基坑开挖最后一次剖切，需要保留上半部分
    if (cutNum == 5) {
        if (worldPosition.y > cutXyz.y) {
            return true;
        }
    }
    if (cutNum == 6) {
        if (worldPosition.x > cutXyz.x) {
          return true;
        }
    }
    if (cutNum == 8) {
        if (worldPosition.y > cutXyz.y && worldPosition.z > cutXyz.z) {
           return true;
        }
    }
    if (cutNum == 12) {
        if (worldPosition.x > cutXyz.x && worldPosition.z > cutXyz.z) {
            return true;
        }
    }
    if (cutNum == 24) {
        if (worldPosition.x > cutXyz.x && worldPosition.y > cutXyz.y) {
           return true;
        }
    }
    //XY面、XZ面、YZ面
    if (cutNum == 48) {
        if (worldPosition.x > cutXyz.x && worldPosition.y < -cutXyz.y && worldPosition.z > cutXyz.z) {
            return true;
        }
    }
    return false;
}
//任意平面切割
bool arbitraryCut()
{
         //角度切换
        bool b1 = (cutRYxyz.z < radians(270.0) && cutRYxyz.z > radians(90.0));
        bool b2 = (cutRYxyz.z >= radians(270.0) || cutRYxyz.z <= radians(90.0));
        bool b3 = (cutRYxyz.x < radians(270.0) && cutRYxyz.x > radians(90.0));
        bool b4 = (cutRYxyz.x >= radians(270.0) || cutRYxyz.x <= radians(90.0));
        bool b5 = ((cutRYxyz.y < radians(-90.0) && cutRYxyz.y > radians(-270.0)) || (cutRYxyz.y < radians(270.0) && cutRYxyz.y > radians(90.0)));
        bool b6 = ((cutRYxyz.y >= radians(-90.0) || cutRYxyz.y <= radians(-270.0)) && (cutRYxyz.y >= radians(270.0) || cutRYxyz.y <= radians(90.0)));

        if (cutNum == 2) {
            //α法向量算法
            float value = tan(cutRYxyz.x) * (worldPosition.y/scaling1.y-center.y) - (worldPosition.z/scaling1.z-center.z) + offset;
            if ((b3  && value < 0.0) || (b4  && value > 0.0)) {
                return true;
            }
        }
        if (cutNum == 4) {
            //γ法向量算法
            float value = -tan(cutRYxyz.z) * (worldPosition.x/scaling2.x-center.x) - (worldPosition.z/scaling2.z-center.z) + offset;
            if ((b1  && value < 0.0) || (b2  && value > 0.0)){
                return true;
            }
        }
        if (cutNum == 6) {
            //β法向量算法
            float value = -tan(cutRYxyz.y) * (worldPosition.x/scaling3.x-center.x) - (worldPosition.y/scaling3.y-center.y) + offset;
            if ((b5  && value < 0.0) || (b6  && value > 0.0)) {
                return true;
            }
        }

        if (cutNum == 8) {
            //α法向量算法
            float value1 = tan(cutRYxyz.x) * (worldPosition.y/scaling1.y-center.y) - (worldPosition.z/scaling1.z-center.z) + offset;
            //γ法向量算法
            float value2 = -tan(cutRYxyz.z) * (worldPosition.x/scaling2.x-center.x) - (worldPosition.z/scaling2.z-center.z) + offset;
            if ((( b3 && value1 < 0.0) || ( b4 && value1 > 0.0)) && (( b1 && value2 < 0.0) || ( b2 && value2 > 0.0))) {
                return true;
            }
        }


        if (cutNum == 12) {
            //α法向量算法
            float value1 = tan(cutRYxyz.x) * (worldPosition.y/scaling1.y-center.y) - (worldPosition.z/scaling1.z-center.z) + offset;
            //β法向量算法
            float value3 = -tan(cutRYxyz.y) * (worldPosition.x/scaling3.x-center.x) - (worldPosition.y/scaling3.y-center.y) + offset;
            if ((( b3 && value1 < 0.0) || ( b4 && value1 > 0.0)) && (( b5 && value3 < 0.0) || ( b6 && value3 > 0.0))) {
                return true;
            }
        }
        if (cutNum == 24) {
            //γ法向量算法
            float value2 = -tan(cutRYxyz.z) * (worldPosition.x/scaling2.x-center.x) - (worldPosition.z/scaling2.z-center.z) + offset;
            //β法向量算法
            float value3 = -tan(cutRYxyz.y) * (worldPosition.x/scaling3.x-center.x) - (worldPosition.y/scaling3.y-center.y) + offset;
            if ((( b1 && value2 < 0.0) || ( b2 && value2 > 0.0 )) && (( b5 && value3 < 0.0) || ( b6 && value3 > 0.0))) {
                return true;
            }
        }
        if (cutNum == 48) {
            //α法向量算法
            float value1 = tan(cutRYxyz.x) * (worldPosition.y/scaling1.y-center.y) - (worldPosition.z/scaling1.z-center.z) + offset;
            //γ法向量算法
            float value2 = -tan(cutRYxyz.z) * (worldPosition.x/scaling2.x-center.x) - (worldPosition.z/scaling2.z-center.z) + offset;
            //β法向量算法
            float value3 = -tan(cutRYxyz.y) * (worldPosition.x/scaling3.x-center.x) - (worldPosition.y/scaling3.y-center.y) + offset;
            if ((( b1 && value2 < 0.0) || ( b2 && value2 > 0.0)) && (( b3 && value1 < 0.0) || ( b4 && value1 > 0.0)) && (( b5 && value3 < 0.0) || ( b6 && value3 > 0.0))) {
                return true;
            }
        }
    return false;
}
//轴面加任意面
bool axialCutAndArbitraryCut()
{
        bool b5 = ((cutRYxyz.y < radians(-90.0) && cutRYxyz.y > radians(-270.0)) || (cutRYxyz.y < radians(270.0) && cutRYxyz.y > radians(90.0)));
        bool b6 = ((cutRYxyz.y >= radians(-90.0) || cutRYxyz.y <= radians(-270.0)) && (cutRYxyz.y >= radians(270.0) || cutRYxyz.y <= radians(90.0)));
        if (cutRYNum == 2) {
            float value = (tan(cutRYxyz.y) * (worldPosition.x/scaling1.x-center.x-cutXyz.x)) + (worldPosition.y-center.y -cutXyz.y);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                return true;
            }

        }
        if (cutRYNum == 4) {
            float value = (tan(cutRYxyz.y) * (worldPosition.x/scaling2.x-center.x-cutXyz.x)) + (worldPosition.y-center.y -cutXyz.y);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                return true;
            }
        }
        if (cutRYNum == 6) {
            float value = (tan(cutRYxyz.y) * (worldPosition.x-center.x-cutXyz.x)) + (worldPosition.z-center.z -cutXyz.z);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                return true;
            }
        }

        return false;
}



void main() {

    vec2 p = vUv;

    vec3 directColor = vec3(1.0, 1.0, 1.0);
    // vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
    vec3 ambientColor = vec3(1.0, 1.0, 1.0);

     vec3 light = normalize(lPosition );
    vec3 light2 = normalize(lPosition2 );

    vec2 aNormal = vec2(0.0,0.0);

    float directional = 0.0;
    float directional2 = 0.0;


    if (modeltype == 0) {
        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);
    }
    if(modeltype == 1)
    {
        aNormal.y = vNormal.z - 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.z + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.z + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (modeltype == 2) {
        aNormal.y = vNormal.y- 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.y + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.y + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }


    if(cutType == 1) {
        if (axialCut()) {
            discard;
        }
    }
    else if (cutType == 2) {
        if (arbitraryCut()) {
            discard;
        }
    }
    else if(cutType == 3)
    {
        // A面
        if (cutZX.z == 1.0)
        {
            if (axialCutAndArbitraryCut()) {
                discard;
            }
        }
        // B面
        else if (cutZX.z == 2.0){
            if (!axialCutAndArbitraryCut()) {
                discard;
            }
        }
    }
    else if(cutType == 4)
    {
        if (axialCutAndArbitraryCut()) {
            discard;
        }
    }


    //
    if (emissive.x!=0.0 || emissive.y!=0.0 || emissive.z!=0.0)
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);
        gl_FragColor =  vec4(vColor, 1.0) * 1.0 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1  )*0.1;
    }
    else
    {
        vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

        a.a=1.0;
        d.a=1.0;
        vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
        vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
        if (isTexture) {

            vec4 c = vec4(vColor, 1.0) * 0.6 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.25+(  a+d);

            c.a = opac;
            if(replicaX == 1.0 && replicaY ==1.0 )
            {
                
                vec4 logo = texture2D(image,vec2(vUv.x, 1.0 - vUv.y));

                gl_FragColor = vec4(logo.rgb, opac);

                
            }
            else {

                vec4 logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY)));
                if (vNormal.x > 0.5 || vNormal.x < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY/2.0 * scale.y)));
                }
                else if (vNormal.z > 0.5 || vNormal.z < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY/2.0 * scale.y)));
                }
                gl_FragColor = vec4(logo.rgb, opac);
            }
        }
        else
        {
            // vec4 c = vec4(vColor, 1.0) * 0.6 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.25;
            // c.a = opac;
            // gl_FragColor = c;
        
            vec4 a1 = directional * vec4(directColor, 1.0);
            vec4 a2 = directional2 * vec4(directColor, 1.0);
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2 )*0.25;
            c.a = opac;
            gl_FragColor = c;
        }

    }

}`


//
THREE.ShaderChunk.CutShader7_ver = `precision mediump float;
    precision highp int;

    varying vec2 vUv;
    varying vec3 worldPosition;
    varying vec3 pixelNormal;

    uniform mat3 tNormal;
    uniform vec3 customColor;
    uniform vec3 lPosition;
    uniform vec3 lPosition2;

    varying vec3 vNormal;
    varying vec3 vColor;
    varying vec3 vPositon;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        worldPosition = position;
        pixelNormal = normal;
        const float r = 0.85;
        const float g = 0.96;
        const float b = 1.0;
        vNormal = normalize(tNormal  * normal);
        vColor = vec3(customColor.r * r, customColor.g * g, customColor.b * b);
        vPositon = position;
    } `
THREE.ShaderChunk.CutShader7_frag = `precision mediump float;
precision highp int;

uniform float radius;
uniform float radiusAdd;
uniform float cutHalfCircle;
uniform int cutType;
uniform vec3 cutXyz;
uniform vec3 center;
uniform float offset;
uniform vec3 emissive;
uniform vec3 lPosition;
uniform vec3 lPosition2;
uniform int modeltype;
varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;
//生成隧道轨迹
bool generateTunnel(vec3 p)
{
    bool c = false;
    for(int i=0;i< gridFigureCount ;i++){
        if(i>0){
            if ( ((gridFigure[i*3+2]> p.z)!=(gridFigure[(i-1)*3+2]> p.z)) && (p.x < (gridFigure[(i-1)*3] -gridFigure[i*3]) * (p.z - gridFigure[i*3+2]) / (gridFigure[(i-1)*3+2] - gridFigure[i*3+2]) +gridFigure[i*3])) {
                c = !c;
            }
        } else {
            if (((gridFigure[i*3+2]> p.z)!=(gridFigure[(gridFigureCount-1)*3+2]> p.z)) && (p.x < (gridFigure[(gridFigureCount-1)*3] -gridFigure[i*3]) * (p.z - gridFigure[i*3+2]) / (gridFigure[(gridFigureCount-1)*3+2] - gridFigure[i*3+2]) +gridFigure[i*3])) {
                c = !c;
            }
        }
    }
    return c;
}
//切圆
bool cutRound(vec3 p)
{
    bool c = false;

    for(int i=0;i< centerPointCount ;i++){
        if (i>0) {
            float centerX=(centerPoint[(i-1)*3] + centerPoint[i*3])/2.0;
            float centerZ=(centerPoint[(i-1)*3+2] + centerPoint[i*3+2])/2.0;
            float k = ((centerPoint[(i-1)*3+2] - centerPoint[i*3+2])/(centerPoint[(i-1)*3] -centerPoint[i*3]));

            if (abs(k) < tan(radians(30.0))) {
                k=((centerPoint[(i-1)*3] - centerPoint[i*3])/(centerPoint[(i-1)*3+2] - centerPoint[i*3+2]));
                if ( pow((p.z-centerZ)-((p.x-centerX)/k),2.0)+pow((p.y- cutXyz.y),2.0)<pow(radius+radiusAdd,2.0) ) {
                    c = true;

                }
            }else {
                if ( pow((p.x-centerX)-((p.z-centerZ)/k),2.0)+pow((p.y- cutXyz.y),2.0)<pow(radius+radiusAdd,2.0) ) {
                    c = true;

                }
            }
        }
    }

    return c;
}

void main() {

    vec2 p = vUv;
    const float ambient = 1.0;
    vec3 directColor = vec3(0.75294, 0.75294, 0.56470);
    vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);

    vec3 light = normalize(lPosition * 100.0 - vPositon);
    vec3 light2 = normalize(lPosition2 * 100.0 - vPositon);

    vec2 aNormal = vec2(0.0,0.0);

    float directional = 0.0;
    float directional2 = 0.0;


    if (modeltype == 0) {
        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);
    }
    if(modeltype == 1)
    {
        aNormal.y = vNormal.z - 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.z + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.z + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (modeltype == 2) {
        aNormal.y = vNormal.y- 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.y + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.y + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (cutType == 4) {
        if (
            generateTunnel(worldPosition) &&
            worldPosition.y < cutXyz.y + radius &&
            worldPosition.y > cutXyz.y - radius
        )
        {
            discard;
        }
    }
    else if(cutType == 5)
    {
        if (
            generateTunnel(worldPosition) &&
            cutRound(worldPosition) &&
            worldPosition.y > cutXyz.y+(radius-cutHalfCircle)
        )
        {
            discard;
        }
    }




    //
    if (emissive.x!=0.0 || emissive.y!=0.0 || emissive.z!=0.0)
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);
        gl_FragColor =  vec4(vColor, 1.0) * 1.0 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1  );
    }
    else
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);

        vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1);
        gl_FragColor = c;
    }

}
`


//
THREE.ShaderChunk.CutShader8_ver =  `precision mediump float;
precision highp int;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

uniform mat3 tNormal;
uniform vec3 customColor;
uniform vec3 lPosition;
uniform vec3 lPosition2;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    worldPosition = position;
    pixelNormal = normal;
    const float r = 0.85;
    const float g = 0.96;
    const float b = 1.0;
    vNormal = normalize(tNormal  * normal);
    vColor = vec3(customColor.r * r, customColor.g * g, customColor.b * b);
    vPositon = position;
} `
THREE.ShaderChunk.CutShader8_frag = `precision mediump float;
precision highp int;
uniform int cutNum;
uniform int cutType;
uniform vec3 cutXyz;
uniform vec3 center;
uniform float offset;
uniform vec3 cutZX;
uniform vec3 scaling1;
uniform vec3 scaling2;
uniform vec3 scaling3;
uniform vec3 emissive;
uniform vec3 lPosition;
uniform vec3 lPosition2;
uniform vec3 scale;
uniform int modeltype;
uniform float opac;
uniform sampler2D image;
uniform bool isTexture;
uniform float ambient;
uniform float replicaX;
uniform float replicaY;


varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;
//轴面加任意面
bool axialCutAndArbitraryCut()
{
    int j = 0;
    for (int i = 0; i < gridFigureCount; i++) {
        bool b5 = ((cutRYxyz[i] < radians(-90.0) && cutRYxyz[i] > radians(-270.0)) || (cutRYxyz[i] < radians(270.0) && cutRYxyz[i] > radians(90.0)));
        bool b6 = ((cutRYxyz[i] >= radians(-90.0) || cutRYxyz[i] <= radians(-270.0)) && (cutRYxyz[i] >= radians(270.0) || cutRYxyz[i] <= radians(90.0)));
        if (cutRYNum[i] == 2) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.y-center.y-gridFigure[i*3+1])) + (worldPosition.z/scaling1.z-center.z -gridFigure[i*3+2]);
            if ((b6 && value < 0.0)||(b5 && value > 0.0))  {
                j++;
                if (j == gridFigureCount) {
                    return true;
                }

            }

        }
        if (cutRYNum[i] == 4) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.x/scaling2.x-(gridFigure[i*3]-center.x))) + (worldPosition.y -(gridFigure[i*3+1]-center.y));
            if ((b6 && value < 0.0)||(b5 && value > 0.0))  {
                j++;
                if (j == gridFigureCount) {
                    return true;
                }
            }
        }
        if (cutRYNum[i] == 6) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.x/scaling2.x-center.x-gridFigure[i*3])) + (worldPosition.z-center.z -gridFigure[i*3+2]);
            if ((b6 && value < 0.0)||(b5 && value > 0.0))  {
                j++;
                if (j == gridFigureCount) {
                    return true;
                }

            }
        }
    }
    return false;
}

void main() {

    vec2 p = vUv;


    vec3 directColor = vec3(1.0, 1.0, 1.0);
    // vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
    vec3 ambientColor = vec3(1.0, 1.0, 1.0);

    vec3 light = normalize(lPosition );
    vec3 light2 = normalize(lPosition2);

    vec2 aNormal = vec2(0.0,0.0);

    float directional = 0.0;
    float directional2 = 0.0;


    if (modeltype == 0) {
        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);
    }
    if(modeltype == 1)
    {
        aNormal.y = vNormal.z - 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.z + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.z + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (modeltype == 2) {
        aNormal.y = vNormal.y- 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.y + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.y + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (axialCutAndArbitraryCut()) {
        discard;
    }



    //
    if (emissive.x!=0.0 || emissive.y!=0.0 || emissive.z!=0.0)
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);
        gl_FragColor =  vec4(vColor, 1.0) * 1.0 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1  );
    }
    else
    {
        vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;

        a.a=1.0;
        d.a=1.0;
        vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
        vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
        if (isTexture) {

            vec4 c = vec4(vColor, 1.0) * 0.6 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.25+(  a+d);

            c.a = opac;
            if(replicaX == 1.0 && replicaY ==1.0 )
            {
                
                vec4 logo = texture2D(image,vec2(vUv.x, 1.0 - vUv.y));

                gl_FragColor = vec4(logo.rgb, opac);

                
            }
            else {

                vec4 logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY)));
                if (vNormal.x > 0.5 || vNormal.x < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY/2.0 * scale.y)));
                }
                else if (vNormal.z > 0.5 || vNormal.z < -0.5) {
                    logo = texture2D(image,vec2(fract(vUv.x * replicaX),fract(vUv.y * replicaY/2.0 * scale.y)));
                }
                gl_FragColor = vec4(logo.rgb, opac);
            }
        }else
        {
            //vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2)*0.1;
            // vec4 c = vec4(vColor, 1.0) * 0.6 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )*0.6;
            // c.a = opac;
            // gl_FragColor = c;
            
            vec4 a1 = directional * vec4(directColor, 1.0);
            vec4 a2 = directional2 * vec4(directColor, 1.0);
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2 )*0.5;
            c.a = opac;
            gl_FragColor = c;
        }

    }

}
`


//
THREE.ShaderChunk.CutShader9_ver = `precision mediump float;
precision highp int;
varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;
uniform mat3 tNormal;
uniform vec3 customColor;
uniform vec3 lPosition;
uniform vec3 lPosition2;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    worldPosition = position;
    pixelNormal = normal;
    const float r = 0.85;
    const float g = 0.96;
    const float b = 1.0;
    vNormal = normalize(tNormal  * normal);
    vColor = vec3(customColor.r * r, customColor.g * g, customColor.b * b);
    vPositon = position;
} `
THREE.ShaderChunk.CutShader9_frag = `uniform int modeltype;
precision mediump float;
precision highp int;
uniform int cutNum;
uniform vec3 cutZX;
uniform vec3 scaling1;
uniform vec3 scaling2;
uniform vec3 scaling3;
uniform vec3 emissive;
uniform vec3 lPosition;
uniform vec3 lPosition2;
uniform int cutType;
uniform vec3 cutXyz;
uniform vec3 center;
uniform float offset;
uniform float opac;
uniform sampler2D image;
uniform bool isTexture;

uniform float replicaX;
uniform float replicaY;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;
//轴面加任意面
bool axialCutAndArbitraryCut()
{
    bool b=false;
    for (int i = 0; i < gridFigureCount; i++) {
        bool b5 = ((cutRYxyz[i] < radians(-90.0) && cutRYxyz[i] > radians(-270.0)) || (cutRYxyz[i] < radians(270.0) && cutRYxyz[i] > radians(90.0)));
        bool b6 = ((cutRYxyz[i] >= radians(-90.0) || cutRYxyz[i] <= radians(-270.0)) && (cutRYxyz[i] >= radians(270.0) || cutRYxyz[i] <= radians(90.0)));
        if (cutRYNum[i] == 2) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.y-center.y-gridFigure[i*3+1])) + (worldPosition.z/scaling1.z-center.z -gridFigure[i*3+2]);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                b=!b;

            }
        }
        if (cutRYNum[i] == 4) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.x/scaling2.x-center.x-gridFigure[i*3])) + (worldPosition.y-center.y -gridFigure[i*3+1]);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                b=!b;
            }
        }
        if (cutRYNum[i] == 6) {
            float value = (tan(cutRYxyz[i]) * (worldPosition.x-center.x-gridFigure[i*3])) + (worldPosition.z-center.z -gridFigure[i*3+2]);
            if ((b6 && value > 0.0)||(b5 && value < 0.0))  {
                b=!b;
            }
        }
    }
    return b;
}

void main() {
    vec2 p = vUv;
    const float ambient = 0.3;//0.6;
    vec3 directColor = vec3(0.75294, 0.75294, 0.56470);
    vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);
    vec3 light = normalize(lPosition * 100.0 - vPositon);
    vec3 light2 = normalize(lPosition2 * 100.0 - vPositon);
    vec2 aNormal = vec2(0.0,0.0);
    float directional = 0.0;
    float directional2 = 0.0;
    if (modeltype == 0) {
        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);
    }
    if(modeltype == 1)
    {
        aNormal.y = vNormal.z - 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.z + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.z + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }
    if (modeltype == 2) {
        aNormal.y = vNormal.y- 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.y + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.y + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }
    if (axialCutAndArbitraryCut()) {
        discard;
    }
    //
    if (emissive.x!=0.0 || emissive.y!=0.0 || emissive.z!=0.0)
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);
        gl_FragColor =  vec4(vColor, 1.0) * 1.0 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1  );
    }
    else
    {
        vec4 a = directional * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        vec4 d = directional2 * texture2D(image,vec2(vUv.x * replicaX,vUv.y * replicaY) )* ambient;
        a.a=1.0;
        d.a=1.0;
        vec4 a1 = directional * vec4(directColor, 1.0) * ambient;
        vec4 a2 = directional2 * vec4(directColor, 1.0) * ambient;
        if (isTexture) {
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1+a2 )+(  a+d);
            c.a = opac;
            if(replicaX == 1.0 && replicaY ==1.0 )
            {
                gl_FragColor = texture2D(image,vec2(vUv.x,vUv.y));
            }else{
                gl_FragColor = c;
            }
        }else
        {
            vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2);
            c.a = opac;
            gl_FragColor = c;
        }
    }
}`


//
THREE.ShaderChunk.CutShaderNew_ver = `precision mediump float;
precision highp int;

varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

uniform mat3 tNormal;
uniform vec3 customColor;
uniform vec3 lPosition;
uniform vec3 lPosition2;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    worldPosition = position;
    pixelNormal = normal;
    const float r = 1.0;
    const float g = 1.0;
    const float b = 1.0;
    vNormal = normalize(tNormal  * normal);
    vColor = vec3(customColor.r * r, customColor.g * g, customColor.b * b);
    vPositon = position;
} `
THREE.ShaderChunk.CutShaderNew_frag = `precision mediump float;
precision highp int;

uniform int cutNum;
uniform int cutType;
uniform vec3 cutXyz;
uniform vec3 cutRYxyz;
uniform vec3 cutZX;

uniform vec3 emissive;
uniform vec3 lPosition;
uniform vec3 lPosition2;
uniform int modeltype;


varying vec2 vUv;
varying vec3 worldPosition;
varying vec3 pixelNormal;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPositon;

void main() {

    vec2 p = vUv;
    const float ambient = 1.0;
    vec3 directColor = vec3(0.75294, 0.75294, 0.56470);
    vec3 ambientColor = vec3(0.12156, 0.12156, 0.12941);

    vec3 light = normalize(lPosition * 100.0 - vPositon);
    vec3 light2 = normalize(lPosition2 * 100.0 - vPositon);

    vec2 aNormal = vec2(0.0,0.0);

    float directional = 0.0;
    float directional2 = 0.0;


    if (modeltype == 0) {
        directional = max(dot(vNormal, light), 0.0);
        directional2 = max(dot(vNormal, light2), 0.0);
    }
    if(modeltype == 1)
    {
        aNormal.y = vNormal.z - 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.z + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.z + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if (modeltype == 2) {
        aNormal.y = vNormal.y- 0.4;
        vec2 alight=vec2(0.0,0.0);
        alight.y = light.y + 0.4;
        vec2 alight2=vec2(0.0,0.0);
        alight2.y = light2.y + 0.4;
        directional = max(dot(aNormal.y, alight.y), 0.0);
        directional2 = max(dot(aNormal.y, alight2.y), 0.0);
    }

    if(cutType == 1) {
        if(cutNum == 2) {
            if(worldPosition.z > cutXyz.z) {
                discard;
            }
        }
        if (cutNum == 4) {
            if (worldPosition.y < -cutXyz.y) {
                discard;
            }
        }
        if (cutNum == 6) {
            if (worldPosition.x > cutXyz.x) {
                discard;
            }
        }
        if (cutNum == 8) {
            if (worldPosition.y < -cutXyz.y && worldPosition.z > cutXyz.z) {
                discard;
            }
        }
        if (cutNum == 12) {
            if (worldPosition.x > cutXyz.x && worldPosition.z > cutXyz.z) {
                discard;
            }
        }
        if (cutNum == 24) {
            if (worldPosition.x > cutXyz.x && worldPosition.y < -cutXyz.y) {
                discard;
            }
        }
        if (cutNum == 48) {
            if (worldPosition.x > cutXyz.x && worldPosition.y < -cutXyz.y && worldPosition.z > cutXyz.z) {
                discard;
            }
        }
    }
    else if (cutType == 2) {
        bool b1 = (cutRYxyz.z < radians(270.0) && cutRYxyz.z > radians(90.0));
        bool b2 = (cutRYxyz.z >= radians(270.0) || cutRYxyz.z <= radians(90.0));
        bool b3 = (cutRYxyz.x < radians(270.0) && cutRYxyz.x > radians(90.0));
        bool b4 = (cutRYxyz.x >= radians(270.0) || cutRYxyz.x <= radians(90.0));
        bool b5 = (cutRYxyz.y < radians(270.0) && cutRYxyz.y > radians(90.0));
        bool b6 = (cutRYxyz.y >= radians(270.0) || cutRYxyz.y <= radians(90.0));

        if (cutNum == 2) {
            if (( b1 && worldPosition.z * 12.0 > tan(cutRYxyz.z) *  -worldPosition.x - 400.0) || ( b2 && worldPosition.z * 12.0 < tan(cutRYxyz.z) * -worldPosition.x - 400.0)){
                discard;
            }
        }
        if (cutNum == 4) {
            if (( b3 && worldPosition.y / 15.0 > tan(cutRYxyz.x) * - (worldPosition.z + 38.2)) || ( b4 && worldPosition.y / 15.0 < tan(cutRYxyz.x) * -(worldPosition.z + 38.2))) {
                discard;
            }
        }

        if (cutNum == 6) {
            if (( b5 && worldPosition.y > tan(cutRYxyz.y) * worldPosition.x) || ( b6 && worldPosition.y < tan(cutRYxyz.y) * worldPosition.x)) {
                discard;
            }
        }
        if (cutNum == 8) {
            if ((( b1 && worldPosition.z * 12.0 > tan(cutRYxyz.z) *  -worldPosition.x - 400.0) || ( b2 && worldPosition.z * 12.0 < tan(cutRYxyz.z) * -worldPosition.x - 400.0) ) && (( b3 && worldPosition.y / 15.0 > tan(cutRYxyz.x) * -(worldPosition.z + 38.2)) || ( b4 && worldPosition.y / 15.0 < tan(cutRYxyz.x) * - (worldPosition.z + 38.2)))) {
                discard;
            }
        }
        if (cutNum == 12) {
            if ((( b1 && worldPosition.z * 12.0 > tan(cutRYxyz.z) *  -worldPosition.x - 400.0) || ( b2 && worldPosition.z * 12.0 < tan(cutRYxyz.z) * -worldPosition.x - 400.0) ) && (( b5 && worldPosition.y > tan(cutRYxyz.y) * worldPosition.x) || ( b6 && worldPosition.y < tan(cutRYxyz.y) * worldPosition.x))) {
                discard;
            }
        }

        if (cutNum == 24) {
            if ((( b3 && worldPosition.y / 15.0 > tan(cutRYxyz.x) * - (worldPosition.z + 38.2)) || ( b4 && worldPosition.y / 15.0 < tan(cutRYxyz.x) * -(worldPosition.z + 38.2))) && (( b5 && worldPosition.y > tan(cutRYxyz.y) * worldPosition.x) || ( b6 && worldPosition.y < tan(cutRYxyz.y) * worldPosition.x))) {
                discard;
            }
        }
        if (cutNum == 48) {
            if ((( b1 && worldPosition.z * 12.0 > tan(cutRYxyz.z) *  -worldPosition.x - 400.0) || ( b2 && worldPosition.z * 12.0 < tan(cutRYxyz.z) * -worldPosition.x - 400.0)) && (( b3 && worldPosition.y / 15.0 > tan(cutRYxyz.x) * -(worldPosition.z + 38.2))) || ( b4 && worldPosition.y / 15.0 < tan(cutRYxyz.x) * -(worldPosition.z + 38.2)) && (( b5 && worldPosition.y > tan(cutRYxyz.y) * worldPosition.x) || ( b6 && worldPosition.y < tan(cutRYxyz.y) * worldPosition.x)) ) {
                discard;
            }
        }
    }
    else if (cutType == 3) {

        bool b1= (cutZX.y < radians(270.0) && cutZX.y > radians(90.0));
        bool b2 = (cutZX.y >= radians(270.0) || cutZX.y <= radians(90.0));

        // A面
        if (cutZX.z == 1.0) {
            if (
                (
                    ( b1 && worldPosition.y > tan(cutZX.y) * worldPosition.x )
                    &&
                    ( worldPosition.x > cutZX.x )
                )
                ||
                (
                    ( b2 && worldPosition.y < tan(cutZX.y) * worldPosition.x )
                    &&
                    ( worldPosition.x > cutZX.x )
                )
            ) {

                discard;
            }
        }
        // B面
        else if (cutZX.z == 2.0){
            if (
                (
                    ( b1 && worldPosition.y > tan(cutZX.y) * worldPosition.x )
                    &&
                    ( worldPosition.x < cutZX.x )
                )
                ||
                (
                    ( b2 && worldPosition.y < tan(cutZX.y) * worldPosition.x )
                    &&
                    ( worldPosition.x < cutZX.x )
                )
            ) {

                discard;
            }
        }

    }



    //
    if (emissive.x!=0.0 || emissive.y!=0.0 || emissive.z!=0.0)
    {
        //gl_FragColor = directional * vec4(emissive, 1.0);
        gl_FragColor =  vec4(emissive, 1.0);
    }
    else
    {
        vec4 a1 = directional * vec4(directColor, 1.0);
        vec4 a2 = directional2 * vec4(directColor, 1.0);

        vec4 c = vec4(vColor, 1.0) * 0.5 + vec4(vColor, 1.0) * vec4(ambientColor, 1.0) * ambient + vec4(vColor, 1.0) * (  a1 + a2  );
        //vec4 c = vec4(vColor, 1.0);
        gl_FragColor = c;
    }

}`


THREE.ShaderChunk.ModelShader_ver = `
precision mediump float;
precision highp int;

varying vec2 vUv;
varying vec3 vPositon;


void main() {



    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vPositon = position;
} `
THREE.ShaderChunk.ModelShader_frag = `uniform bool cutAxialEnable; \n
uniform int cutAxialXYZ; \n
uniform float cutAxialDistance; \n
uniform float cutAxialAngle; \n

varying vec3 vPositon; \n

void main () { \n
    #ifdef CUT_POLYGON_ENABLE \n
        bool pointInPolygon = booleanPointInPolygon(vPositon, cutPolygonPoints); \n
        if (cutPolygonSide && pointInPolygon) { \n
            discard; \n
        } else if (!cutPolygonSide && !pointInPolygon) { \n
            discard; \n
        } \n
    #endif \n
    if (cutAxialEnable) {\n
        if (cutAxialXYZ == 0) { //YZ面\n
            if (abs(cos(cutAxialAngle)) == 1.0) { //此时无斜率\n
                if (cos(cutAxialAngle) * -vPositon.x > cutAxialDistance) {\n
                    discard;\n
                }\n
            } \n
            else {\n
                //斜率方程 x = kz + b\n
                if (vPositon.x * tan(M_PI / 2.0 + cutAxialAngle) + vPositon.z > 0.0) {\n
                    discard;\n
                }\n
            }\n

        }\n
    }\n
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.6); \n
}\n`