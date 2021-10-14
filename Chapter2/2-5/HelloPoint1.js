var VexShader = 
    'void main(){\n' + 
    'gl_Position=vec4(0.0, 0.0, 0.0, 1.0);\n' + 
    'gl_PointSize=20.0;\n' +
    '}';
var FragShader = 
    'void main(){\n' +
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    console.log(gl);
    initShaders(gl, VexShader, FragShader);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}