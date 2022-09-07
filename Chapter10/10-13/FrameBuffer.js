// TranslatedRotatedTriangle.js (c) 2012 matsuda
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ProjectMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' + 
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' + 
  '}\n';

var offScreen_width = 256;
var offScreen_height = 256;

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');

    let cube = initVertexBufferForCube();
    let texture = initTextures();
    // let plane = initVertextBufferForPlane();
    // 初始化帧缓冲区对象
    let fbo = initFrameBufferObject();
    function initVertexBufferForCube(){
        // Vertex coordinates
         var vertices = new Float32Array([
           1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
           1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
           1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
          -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
          -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
           1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
        ]);

        // Texture coordinates
        var texCoords = new Float32Array([
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
        ])
        var n = 6;
        let o = {};
        o.vertexBuffer = createArrayBuffer(vertices, 3, gl.FLOAT);
        o.texBuffer = createArrayBuffer(texCoords, 2, gl.FLOAT);
        o.indexBuffer = createElementArrayBuffer(indices, gl.UNSIGNED_BYTE);
        o.numIndices = indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return o;
    };
    function initTextures() {
        var texture = gl.createTexture();   // Create a texture object
        // Get storage location of u_Sampler
        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
        if (!u_Sampler) {
          console.log('Failed to get the storage location of u_Sampler');
          return null;
        }
        var image = new Image();  // Create image object
        if (!image) {
          console.log('Failed to create the Image object');
          return null;
        }
        // Register the event handler to be called when image loading is completed
        image.onload = function() {
          // Write image data to texture object
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          // Pass the texure unit 0 to u_Sampler
          gl.uniform1i(u_Sampler, 0);
          gl.bindTexture(gl.TEXTURE_2D, null); // Unbind the texture object
          drawFrame();
        };
        // Tell the browser to load an Image  
        image.src = '../../resources/sky.jpg';
        return texture;
    }
    let projectMatrixFBO = new Matrix4();
    var viewMatrixFBO = new Matrix4();   // Prepare view projection matrix for FBO
    projectMatrixFBO.setPerspective(30.0, offScreen_width/offScreen_height, 1.0, 100.0);
    viewMatrixFBO.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrixFBO.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrixFBO.elements);
    
    var currentAngle = 0.0; // Current rotation angle (degrees)
    // var tick = function() {
    //   currentAngle = animate(currentAngle);  // Update current rotation angle
    //   drawFrame(gl, canvas, fbo, plane, cube, currentAngle, texture, viewProjMatrix, viewProjMatrixFBO);
    //   window.requestAnimationFrame(tick, canvas);
    // };
    // tick();
    let near = 0.0, far = 0.5;
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewMatrix.setLookAt(3.05, 2.5, 15.0, 0, 0, -2, 0, 1, 0);
    projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    function drawSolidCube(program, cube, x){
        gl.useProgram(program);
        // 顶点坐标
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
        gl.vertexAttribPointer(program.a_Position, cube.vertexBuffer.num, cube.vertexBuffer.type, false, 0, 0);
        gl.enableVertexAttribArray(program.a_Position);
        // 顶点颜色
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorBuffer);
        gl.vertexAttribPointer(program.a_Color, cube.colorBuffer.num, cube.colorBuffer.type, false, 0, 0 );
        gl.enableVertexAttribArray(program.a_Color);
        // 顶点索引值
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
        drawCube(program, cube, x);
    }
    function initFrameBufferObject(){
        var frameBuffer, texture, depthBuffer;
        frameBuffer = gl.createFramebuffer();
        // 创建纹理对象，设置其尺寸和参数
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offScreen_width, offScreen_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
        frameBuffer.texture = texture;
        // 创建渲染缓冲区对象，并设置其尺寸和参数
        depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offScreen_width, offScreen_height);
        
        // 将上面生成的纹理对象和渲染缓冲区对象关联到帧缓冲区对象上
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // 检查帧缓冲区对象是否被正确设置
        var result = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if ( result !== gl.FRAMEBUFFER_COMPLETE){
            throw Error('Framebuffer object is incomplete: ' + e.toString());
            return ;
        }
        return frameBuffer;
        
    }
    function createArrayBuffer(data, num, type) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        buffer.num = num;
        buffer.type = type;
        return buffer;
    }
    function createElementArrayBuffer(data, type){
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        buffer.type = type;
        return buffer;
    }
    function drawFrame(){
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, offScreen_width, offScreen_height);
        gl.clearColor(0.2, 0.2, 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // 在帧缓冲区中绘制立方体
        drawTexturedCube();
    }
    function drawTexturedCube(){
        // Calculate a model matrix
        modelMatrix.setRotate(20.0, 1.0, 0.0, 0.0);
        // modelMatrix.rotate(angle, 0.0, 1.0, 0.0);
        // Calculate the model view project matrix and pass it to u_MvpMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        // 顶点坐标
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
        gl.vertexAttribPointer(a_Position, cube.vertexBuffer.num, cube.vertexBuffer.type, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.texBuffer);
        gl.vertexAttribPointer(a_TexCoord, cube.texBuffer.num, cube.texBuffer.type, false, 0, 0);
        // 顶点索引值
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
        console.log('a');
        gl.drawElements(gl.TRIANGLES, cube.numIndices, cube.indexBuffer.type, 0); 
    }
    function drawArray(){
        
    }
    drawFrame();
    var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)

    var last = Date.now(); // Last time that this function was called
    function animate(angle) {
      var now = Date.now();   // Calculate the elapsed time
      var elapsed = now - last;
      last = now;
      // Update the current rotation angle (adjusted by the elapsed time)
      var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
      return newAngle % 360;
    }

}
