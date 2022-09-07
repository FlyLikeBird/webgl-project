// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ProjectMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform bool u_Clicked;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  ' gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  ' if ( u_Clicked ){\n' +
  '  v_Color = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  ' } else { \n' + 
  '  v_Color = vec4(0.5, 0.5, 0.5, 1.0);\n' +
  ' }\n' + 
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  ' gl_FragColor = v_Color;\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var hud = document.getElementById('hud');
    var gl = canvas.getContext('webgl');
    var ctx = hud.getContext('2d');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    var u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');
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
        var texBuffer = gl.createBuffer();
        var normalBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标写入a_Position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
      
        // 将顶点索引数据写入缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return indices.length;
    }
    let near = 0.0, far = 0.5;
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    var normalMatrix = new Matrix4();
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    let angle_step = 15;
    let g_last = Date.now();
    viewMatrix.setLookAt(3.0, 3.0, 7.0, 0, 0, 0, 0, 1, 0);
    // console.log(modelMatrix);
    projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // 监听鼠标单击事件
    hud.onmousedown = function(ev){
        let x = ev.clientX, y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        if ( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom ) {
            let innerX = x - rect.left, innerY = y - rect.top;
            console.log(innerX, innerY );
            var picked = check(innerX, innerY);
            if ( picked ) console.log('the cude was selected'); 
        }
    }
    draw();
    draw2D();
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
    function draw2D(){
        ctx.beginPath();
        ctx.moveTo(100,100);
        ctx.lineTo(300,400);
        ctx.stroke();
    }
}
