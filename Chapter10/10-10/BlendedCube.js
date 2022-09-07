// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ProjectMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectMatrix * u_ViewMatrix * a_Position ;\n' +
  '  gl_PointSize = 10.0;\n' +
  ' v_Color = a_Color;\n' +
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'varying vec4 v_Color;\n' + 
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' + 
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
        var indices = new Uint8Array([
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // right
            8, 9, 10, 8, 10, 11, // top
            16, 17, 18, 16, 18, 19, // left
            12, 13, 14, 12, 14, 15, // bottom
            20, 21, 22, 20, 22, 23 // back
        ])
        var n = 6;
        var vertexBuffer = gl.createBuffer();
        var colorBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标和顶点颜色写入a_Position/a_Color;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);
        // 将顶点索引数据写入缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return indices.length;
    }
    let near = 0.0, far = 0.5;
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
    
    render();
}
