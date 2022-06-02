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
            1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // front-右上角 白色
            -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // front-左上角 品红色
            -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // front-左下角 红色
            1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // front-右下角 黄色
            1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // back-右下角 绿色
            1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // back-右上角 青色
            -1.0, 1.0, -1.0, 0.0, 0.0, 1.0 // back-左上角 蓝色
            -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // back-左下角 黑色 
        ]);
        var indices = new Uint8Array([
            0, 1, 2, 0, 2, 3, // front
            0, 3, 4, 0, 4, 5, // right
            0, 5, 6, 0, 6, 1, // top
            1, 6, 7, 1, 2, 7, // left
            2, 7, 4, 2, 4, 3, // bottom
            6, 7, 4, 6, 5, 4 // back
        ])
        var n = 6;
        var vertexBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标和顶点颜色写入a_Position/a_Color;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var FSize = vertices.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSize * 6, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSize * 6, FSize * 3);
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
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    function render(){
        // 视图矩阵 X 模型矩阵 ，变换次序影响结果
        viewMatrix.setLookAt(3.05, 2.5, 10.0, 0, 0, -2, 0, 1, 0);
        projectMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0 );
    }
    
    render();
}
