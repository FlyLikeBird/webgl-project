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

function main2() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
//   var gl = getWebGLContext(canvas);
    var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  
  // Create Matrix4 object for model transformation
  var modelMatrix = new Matrix4();

  // Calculate a model matrix
  var ANGLE = 30.0; // The rotation angle
  var Tx = 0.3;     // Translation distance
  modelMatrix.setTranslate(Tx, 0, 0);  // Set translation matrix
//   modelMatrix.setRotate(ANGLE, 0, 0, 1);  // Multiply modelMatrix by the calculated rotation matrix

  // Pass the model matrix to the vertex shader
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // var matrix = new Float32Array([
    //     cosB, sinB, 0.0, 0.0,
    //     -sinB, cosB, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);
    var matrix = new Matrix4();
    matrix.setTranslate(0.3, 0, 0);
    matrix.rotate(30, 0, 0, 1);
    
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var n = initVertexBuffer();
    
    gl.drawArrays(gl.TRIANGLES, 0, n);

    
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // 以顶点为起始点，逆时针方向绘制三角形来判断最后一条边;
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            0.0, 0.3, -0.3, -0.3, 0.3, -0.3
        ]);
        var n = 3;
        var vertexBuffer = gl.createBuffer();
        console.log(vertexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        return n;
    }
   
}
