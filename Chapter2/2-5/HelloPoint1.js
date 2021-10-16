var VexShader = 
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' + 
    'gl_Position=a_Position;\n' + 
    'gl_PointSize=a_PointSize;\n' +
    '}';
var FragShader = 
    'void main(){\n' +
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);\n' +
    '}';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    console.log(gl);
    initShaders(gl, VexShader, FragShader);
    // console.log(gl.program);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    console.log(a_Position);
    console.log(a_PointSize);
    gl.vertexAttrib3f(a_Position, 0.0, -1.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 40.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}