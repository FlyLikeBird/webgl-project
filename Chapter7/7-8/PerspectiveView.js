// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_rotateMatrix;\n' +
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
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    
    var n = initVertexBuffer();
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            // X轴右侧区域 
            0.75, 1.0, -4.0, 0.4, 1.0, 0.4, 
            0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
            1.25, -1.0, -4.0, 1.0, 0.4, 0.4,
            // 黄色三角形在中间
            // 0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
            // 0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
            // 1.25, -1.0, -2.0, 1.0, 0.4, 0.4,    
            // 蓝色三角形在最前面
            0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
            0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
            1.25, -1.0, 0.0, 1.0, 0.4, 0.4, 
            // X轴左侧区域
            -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, 
            -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
            -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,
            // 黄色三角形在中间
            -0.75, 1.0, -2.0, 1.0, 1.0, 0.4,
            -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
            -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,
            // 蓝色三角形在最前面
            -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,
            -0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
            -1.25, -1.0, 0.0, 1.0, 0.4, 0.4, 
        ]);
        var n = 18;
        var vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var FSize = vertices.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSize * 6, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSize * 6, FSize * 3);
        gl.enableVertexAttribArray(a_Color);
        // gl.uniformMatrix4fv(u_rotateMatrix, false, matrix.elements);
        // gl.drawArrays(gl.POINTS, 0, 1);
        return n;
    }
    let near = 0.0, far = 0.5;
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    
    function render(){
        gl.clear(gl.COLOR_BUFFER_BIT); 
        // 视图矩阵 X 模型矩阵 ，变换次序影响结果
        // projectMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, near, far); 
        viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
        // projectMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 1, 100);
        projectMatrix.setPerspective(60, canvas.width  / canvas.height , 1, 100);
        console.log(projectMatrix);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, n);
        // console.log(projectMatrix.multiply(viewMatrix));
    }
   
    render();
}
