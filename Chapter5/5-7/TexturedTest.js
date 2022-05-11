// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TextCoord;\n' +
  'varying vec2 v_TextCoord;\n' +
  'void main() {\n' +
  '  gl_Position =  a_Position;\n' +
  '  v_TextCoord = a_TextCoord;\n'  +  
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform sampler2D u_Sampler;\n' +  
  'varying vec2 v_TextCoord;\n' + 
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TextCoord);\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var n = initVertexBuffer();
    if ( initTexture()){
   
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // 以顶点为起始点，逆时针方向绘制三角形来判断最后一条边;
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            // -0.5, 0.5, -0.5, 0.5,
            // -0.5, -0.5, -0.5, -0.5,
            // 0.5, 0.5, 0.5, 0.5,
            // 0.5, -0.5, 0.5, -0.5
            -0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
            0.5, 0.5, 3.0, 1.0,
            0.5, -0.5, 3.0, 0.0
        ]);
        var n = 4;
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        var FSize = vertices.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSize * 4, 0);
        gl.enableVertexAttribArray(a_Position);
        var a_TextCoord = gl.getAttribLocation(gl.program, 'a_TextCoord');
        gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSize * 4, FSize * 2);
        gl.enableVertexAttribArray(a_TextCoord);
        return n;
    }
    function initTexture(){
        var textTure = gl.createTexture();
        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
        var image = new Image();
        image.src = '../../resources/sky.jpg';
        image.onload = ()=>{
            loadTexture(textTure, u_Sampler, image);
        }
        return true;
    }
    function loadTexture(textTure, u_Sampler, image){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTure);
        // 配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
   
}
