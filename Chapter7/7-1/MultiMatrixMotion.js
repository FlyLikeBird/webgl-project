// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_rotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_rotateMatrix * a_Position ;\n' +
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
    var u_rotateMatrix = gl.getUniformLocation(gl.program, 'u_rotateMatrix');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var matrix = new Matrix4();
    // setTimeout(()=>{
    //     matrix.setRotate(30, 0.5, 0.5, 0.0);
    //     gl.uniformMatrix4fv(u_rotateMatrix, false, matrix.elements);
    //     var prevMatrix = new Matrix4().set(matrix);
    //     gl.drawArrays(gl.POINTS, 0, 1);
    //     gl.uniformMatrix4fv(u_rotateMatrix, false, new Matrix4().elements);
    //     gl.drawArrays(gl.LINES, 1, 2);
    //     console.log(matrix.elements);
    //     setTimeout(()=>{
            
    //         render();
    //     },2000)
    // },100)
    let currentAngle = 0;
    var n = initVertexBuffer();
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            0.6, 0.0, 0.0, 0.0, 0.0, 1.0, 
            0.5, 0.0, 0.0, 0.0, 1.0, 1.0,
            0.5, 0.5, 0.5, 0.0, 1.0, 1.0
        ]);
        var n = 3;
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
    let TMatrix = new Matrix4();
    let R1Matrix = new Matrix4();
    let R2Matrix = new Matrix4();
    let R1InvertMatrix = new Matrix4();
    let TInvertMatrix = new Matrix4();
    function render(){
        gl.clear(gl.COLOR_BUFFER_BIT); 
        currentAngle += 0.5;   
        
        TMatrix.setTranslate(-0.5, 0.0, 0.0);
        R1Matrix.setRotate(-90, 0.5, 0.0, 0.0);
        R2Matrix.setRotate(currentAngle, 0.0, 0.5, 0.0);
        
        // multipy 规定右乘矩阵
        // rotateMatrix.multiply(matrix);
        // matrix.invert().multiply(rotateMatrix.multiply(matrix));
        // 
        R1Matrix.multiply(TMatrix);
        R2Matrix.multiply(R1Matrix);
        
        R1InvertMatrix.setRotate(90, 0.5, 0, 0).multiply(R2Matrix);
        TInvertMatrix.setTranslate(0.5, 0, 0).multiply(R1InvertMatrix);
        // matrix.rotate(currentAngle, 0, 1, 0 );
        gl.uniformMatrix4fv(u_rotateMatrix, false, TInvertMatrix.elements);
        gl.drawArrays(gl.POINTS, 0, 1);
        gl.uniformMatrix4fv(u_rotateMatrix, false, new Matrix4().elements);
        gl.drawArrays(gl.LINES, 1, 2);
        requestAnimationFrame(render);
    }
    render();
}
