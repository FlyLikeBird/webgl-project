var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' + 
    'gl_Position = a_Position;\n' + 
    'gl_PointSize = 50.0;\n' +
    '}';
var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    ' float dist = distance(gl_PointCoord, vec2(0.5, 0.5));\n' + 
    ' if ( dist < 0.5 ) { \n' +
    ' gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n' +
    '} else { \n' +
    ' discard;}\n' +
    '}';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    console.log(gl);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    var points = [];
    var colors = [];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var n = initVertexBuffer();
    gl.drawArrays(gl.POINTS, 0, 3);
    function initVertexBuffer(){
        var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
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