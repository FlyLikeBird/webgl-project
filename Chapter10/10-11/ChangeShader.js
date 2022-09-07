// TranslatedRotatedTriangle.js (c) 2012 matsuda
var SOLID_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ProjectMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  ' v_Color = a_Color;\n' +
  '}\n';
// Fragment shader program
var SOLID_FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'varying vec4 v_Color;\n' + 
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' + 
  '}\n';
var TEXTURE_VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_ProjectMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){ \n' +
    ' gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    ' v_TexCoord = a_TexCoord;\n' + 
    '}\n';
var TEXTURE_FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' + 
    'void main(){ \n' +
    ' gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '} \n';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
    var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
    
    solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
    solidProgram.a_Color = gl.getAttribLocation(solidProgram, 'a_Color');
    solidProgram.u_ModelMatrix = gl.getUniformLocation(solidProgram, 'u_ModelMatrix');
    solidProgram.u_ViewMatrix = gl.getUniformLocation(solidProgram, 'u_ViewMatrix');
    solidProgram.u_ProjectMatrix = gl.getUniformLocation(solidProgram, 'u_ProjectMatrix');
    
    texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
    texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
    texProgram.u_ModelMatrix = gl.getUniformLocation(texProgram, 'u_ModelMatrix');
    texProgram.u_ViewMatrix = gl.getUniformLocation(texProgram, 'u_ViewMatrix');
    texProgram.u_ProjectMatrix = gl.getUniformLocation(texProgram, 'u_ProjectMatrix');

    let cube = initVertexBuffer();
    let texture = initTexture(texProgram, cube);
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            // 蓝色三角形在最前面
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // front
            1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // right
            1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // top
            1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // bottom
            -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // left
            1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0 // back
        ]);
        var colors = new Float32Array([     // Colors
            0.5, 0.5, 1.0, 1.0,  0.5, 0.5, 1.0, 1.0,  0.5, 0.5, 1.0, 1.0,  0.5, 0.5, 1.0, 1.0,  // v0-v1-v2-v3 front(blue)
            0.5, 1.0, 0.5, 1.0,  0.5, 1.0, 0.5, 1.0,  0.5, 1.0, 0.5, 1.0,  0.5, 1.0, 0.5, 1.0,  // v0-v3-v4-v5 right(green)
            1.0, 0.5, 0.5, 1.0,  1.0, 0.5, 0.5, 1.0,  1.0, 0.5, 0.5, 1.0,  1.0, 0.5, 0.5, 1.0,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.5, 1.0,  1.0, 1.0, 0.5, 1.0,  1.0, 1.0, 0.5, 1.0,  1.0, 1.0, 0.5, 1.0,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0, 1.0,  1.0, 1.0, 1.0, 1.0,  1.0, 1.0, 1.0, 1.0,  1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.5, 1.0, 1.0, 1.0,  0.5, 1.0, 1.0, 1.0,  0.5, 1.0, 1.0, 1.0,  0.5, 1.0, 1.0, 1.0   // v4-v7-v6-v5 back
        ]);
        var texCoords = new Float32Array([   // Texture coordinates
           1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
           0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
           1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
           0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
           1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
           0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
        ]);
        var indices = new Uint8Array([
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // right
            8, 9, 10, 8, 10, 11, // top
            16, 17, 18, 16, 18, 19, // left
            12, 13, 14, 12, 14, 15, // bottom
            20, 21, 22, 20, 22, 23 // back
        ])
        var n = 6;
        let o = {};
        o.vertexBuffer = createArrayBuffer(vertices, 3, gl.FLOAT);
        o.colorBuffer = createArrayBuffer(colors, 4, gl.FLOAT);
        o.texBuffer = createArrayBuffer(texCoords, 2, gl.FLOAT);
        o.indexBuffer = createElementArrayBuffer(indices, gl.UNSIGNED_BYTE);
        o.numIndices = indices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return o;
    }
    function initTexture(program, cube){
        let texture = gl.createTexture();
        let image = new Image();
        image.src = '../../resources/orange.jpg';
        image.onload = ()=>{
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.useProgram(program);
            console.log(program);
            gl.uniform1i(program.u_Sampler, 0);
            drawSolidCube(solidProgram, cube, -2.0);
            drawTexCube(texProgram, cube, 2.0);
        }
    }
    let near = 0.0, far = 0.5;
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    viewMatrix.setLookAt(3.05, 2.5, 15.0, 0, 0, -2, 0, 1, 0);
    projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
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
    function drawTexCube(program, cube, x){
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
        gl.vertexAttribPointer(program.a_Position, cube.vertexBuffer.num, cube.vertexBuffer.type, false, 0, 0);
        gl.enableVertexAttribArray(program.a_Position);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.texBuffer);
        gl.vertexAttribPointer(program.a_TexCoord, cube.texBuffer.num, cube.texBuffer.type, false, 0, 0 );
        gl.enableVertexAttribArray(program.a_TexCoord);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
        drawCube(program, cube, x);
    }
    function drawCube(program, cube, x){
        modelMatrix.setTranslate(x, 0.0, 0.0);

        gl.uniformMatrix4fv(program.u_ModelMatrix, false, modelMatrix.elements);
        gl.uniformMatrix4fv(program.u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(program.u_ProjectMatrix, false, projectMatrix.elements);
        console.log(cube);
        gl.drawElements(gl.TRIANGLES, cube.numIndices, cube.indexBuffer.type, 0);
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
    
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
}
