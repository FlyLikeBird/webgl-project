// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ProjectMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectMatrix * u_ViewMatrix * a_Position ;\n' +
  ' v_TexCoord = a_TexCoord;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'varying vec2 v_TexCoord;\n' +
  'uniform sampler2D u_Sampler;\n' + 
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' + 
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    var n = initVertexBuffer();
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
            0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  // v0-v1-v2-v3 front(blue)
            0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  // v7-v4-v3-v2 down
            0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4   // v4-v7-v6-v5 back
        ]);
        var texCoords = new Float32Array([
            1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
            0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
            1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
            1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
            0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
            0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
        ]);

        var indices = new Uint8Array([
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // right
            8, 9, 10, 8, 10, 11, // top
            16, 17, 18, 16, 18, 19, // left
            12, 13, 14, 12, 14, 15, // bottom
            20, 21, 22, 20, 22, 23 // back
        ]);
        var n = 6;
        var vertexBuffer = gl.createBuffer();
        var colorBuffer = gl.createBuffer();
        var texBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标和顶点颜色写入a_Position/a_Color;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
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
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    function render(){
        // 视图矩阵 X 模型矩阵 ，变换次序影响结果
        viewMatrix.setLookAt(3.05, 2.5, 10.0, 0, 0, -2, 0, 1, 0);
        projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
    }
    createTexture();
    function createTexture(){
        let level = 0;
        let internalFormat = gl.RGB;
        let width = 3;
        let height = 2;
        let border = 0;
        let format = gl.RGB;
        let type = gl.UNSIGNED_BYTE;
        // alignment = 4
        let data = new Uint8Array([
            255, 255, 255, 
            128, 128, 155, 
            128, 128, 128, 
            120, 120, 220, 
            28, 68, 120, 
            30, 30, 120, 
            60, 60, 255// 255, 0, 0, 
            // 255, 255, 0, 0, 0, 255
        ]);
        // alignment = 8;
        // let data = new Uint8Array([
        //     255, 255, 255, 
        //     128, 128, 55, 
        //     128, 128, 128, 
        //     // alignment - 1
        //     0, 0, 0, 0, 0, 0, 110,
        //     168, 68, 120, 
        //     220, 30, 120, 
        //     60, 60, 255,
        //     0, 0, 0, 0, 0, 0, 110,
        //     68, 68, 120, 
        //     220, 30, 120, 
        //     60, 60, 255
        // ]);
        let texture = gl.createTexture();
        // gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const alignment = 4;
        // alignment 是指像素换行时的对齐的字节数
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);
        // 设置筛选器，我们不需要使用贴图所以就不用筛选器了
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.uniform1i(u_Sampler, 1);  
    }
    render();
}
