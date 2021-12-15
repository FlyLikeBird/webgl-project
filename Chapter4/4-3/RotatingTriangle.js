// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var matrix = new Matrix4();
    var n = initVertexBuffer();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var i = 0;
    function render(){
        console.log('a');
        gl.clear(gl.COLOR_BUFFER_BIT);  
        i += 1;      
        matrix.setRotate(10 + i, 0, 1, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, n);
        // requestAnimationFrame(render);
    }
    render();
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // 以顶点为起始点，逆时针方向绘制三角形来判断最后一条边;
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            0.0, 0.3, -0.3, -0.3, 0.3, -0.3
        ]);
        var n = 3;
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        return n;
    }
   
}
