// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ProjectMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_FogMatrix;\n' + 
  'uniform vec4 u_Eye;\n' +
  'varying vec4 v_Color;\n' +
  'varying float v_Dist;\n' +
  'void main() {\n' +
  ' gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  ' v_Color = a_Color;\n' +
  // 计算顶点与视点的距离 ,distance()是内置函数，计算空间中两个点之间的距离
  ' v_Dist = distance( u_ModelMatrix * a_Position, u_Eye);\n' +
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  // 雾化的颜色
  'uniform vec3 u_FogColor;\n' +
  // 雾化的起点和终点
  'uniform vec2 u_FogDist;\n' +
  'varying vec4 v_Color;\n' +
  'varying float v_Dist;\n' +
  'void main() {\n' +
  ' float fogFactor = clamp((u_FogDist.y - v_Dist)/(u_FogDist.y - u_FogDist.x), 0.0, 1.0);\n' +
  ' vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);\n' +
  ' gl_FragColor = vec4(color, v_Color.a);\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_FogMatrix = gl.getUniformLocation(gl.program, 'u_FogMatrix');
    var u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
    var u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
    var u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
    
    var n = initVertexBuffer();
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // Create a cube
          //    v6----- v5
          //   /|      /|
          //  v1------v0|
          //  | |     | |
          //  | |v7---|-|v4
          //  |/      |/
          //  v2------v3
          var vertices = new Float32Array([   // Vertex coordinates
          1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
          1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
          1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
         -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
         -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
          1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
        ]);
        var colors = new Float32Array([     // Colors
          0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front
          0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right
          1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up
          1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
          1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
          0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ]);
        // Indices of the vertices
        var indices = new Uint8Array([
          0, 1, 2,   0, 2, 3,    // front
          4, 5, 6,   4, 6, 7,    // right
          8, 9,10,   8,10,11,    // up
         12,13,14,  12,14,15,    // left
         16,17,18,  16,18,19,    // down
         20,21,22,  20,22,23     // back
        ]);
        var n = 6;
        var vertexBuffer = gl.createBuffer();
        var colorBuffer = gl.createBuffer();
        var texBuffer = gl.createBuffer();
        var normalBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标写入a_Position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);
        // 将顶点索引数据写入缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return indices.length;
    }
    let near = 0.0, far = 0.5;
    // 雾化颜色
    var fogColor = new Float32Array([0.237, 0.431, 0.423]);
    var fogDist = new Float32Array([55, 80]);
    var eye = new Float32Array([25, 65, 35, 1.0]);
    // 雾化的起点和终点与视点间的距离 [起点距离，终点距离];
    gl.uniform3fv(u_FogColor, fogColor);
    gl.uniform2fv(u_FogDist, fogDist);
    gl.uniform4fv(u_Eye, eye);
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    var normalMatrix = new Matrix4();
    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    gl.enable(gl.DEPTH_TEST);

    let angle_step = 15;
    let g_last = Date.now();
    viewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 0, 0, 0, 1, 0);
    // console.log(modelMatrix);
    projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 1000);
    modelMatrix.setScale(10, 10, 10);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // 监听鼠标单击事件
    document.onkeydown = (ev)=>{
        switch (ev.keyCode) {
            case 38: // Up arrow key -> Increase the maximum distance of fog
              fogDist[1]  += 1;
              break;
            case 40: // Down arrow key -> Decrease the maximum distance of fog
              if (fogDist[1] > fogDist[0]) fogDist[1] -= 1;
              break;
            default: return;
          }
          console.log(fogDist);
          gl.uniform2fv(u_FogDist, fogDist);   // Pass the distance of fog
          draw();
    }
    draw();
    function check(x, y){
        var picked = false;
        gl.uniform1i(u_Clicked, 1);
        draw();
        // 读取点击位置的像素颜色值
        let pixels = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels);
        if ( pixels[0] === 255 ) {
            picked = true;
        }
        gl.uniform1i(u_Clicked, 0);
        draw();
        return picked;
    }
    function draw(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
    }
   
}
