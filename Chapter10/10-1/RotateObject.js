// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'attribute vec4 a_Normal;\n' + // 逐顶点定义法向量
  'uniform mat4 u_ProjectMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  ' gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  ' v_TexCoord = a_TexCoord;\n' +
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' + 
  'void main() {\n' +
  ' gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
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

        var texCoords = new Float32Array([   // Texture coordinates
           1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
           0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
           1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
           1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
           0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
           0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
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
        // 将纹理坐标写入a_TexCoord;
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_TexCoord);
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
    
    // 监听鼠标拖动事件
    let currentAngle = [0.0, 0.0];
    initEventHandlers();
    if (!initTextures(gl)) {
        console.log('Failed to intialize the texture.');
        return;
    }   
    function initEventHandlers(){
        var dragging = false;
        var lastX = -1, lastY = -1;
        canvas.onmousedown = function(ev){
            let x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            if ( rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom ) {
                lastX = x;
                lastY = y;
                dragging = true;
            }
        }
        canvas.onmouseup = function(ev){ dragging = false };
        canvas.onmousemove = function(ev){
            let x = ev.clientX, y = ev.clientY;
            if ( dragging ){
                let factor = 100 / canvas.height;
                console.log(factor);
                console.log(x - lastX);
                var dx = factor * ( x - lastX );
                var dy = factor * ( y - lastY );
                currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
                currentAngle[1] = currentAngle[1] + dx;
                console.log(currentAngle);
                draw();
            }
            lastX = x;
            lastY = y;
        }
    }
    function initTextures(gl) {
        // Create a texture object
        var texture = gl.createTexture();
        if (!texture) {
          console.log('Failed to create the texture object');
          return false;
        }
      
        // Get the storage location of u_Sampler
        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
        if (!u_Sampler) {
          console.log('Failed to get the storage location of u_Sampler');
          return false;
        }
      
        // Create the image object
        var image = new Image();
        if (!image) {
          console.log('Failed to create the image object');
          return false;
        }
        // Register the event handler to be called when image loading is completed
        image.onload = function(){ loadTexture(gl, texture, u_Sampler, image); };
        // Tell the browser to load an Image
        image.src = '../../resources/sky.jpg';
      
        return true;
      }
      
      function loadTexture(gl, texture, u_Sampler, image) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
        // Activate texture unit0
        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the image to texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      
        // Pass the texure unit 0 to u_Sampler
        gl.uniform1i(u_Sampler, 0);
        draw();
      }
    function draw(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        modelMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0);
        modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
    }
}
