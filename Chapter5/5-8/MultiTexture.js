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
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +  
  'varying vec2 v_TextCoord;\n' + 
  'void main() {\n' +
  ' vec4 color0 = texture2D(u_Sampler0, v_TextCoord);\n' +
  ' vec4 color1 = texture2D(u_Sampler1, v_TextCoord);\n' +
  '  gl_FragColor = color0 * color1;\n' +
  
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var n = initVertexBuffer();
    if ( initTexture()){

    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // 以顶点为起始点，逆时针方向绘制三角形来判断最后一条边;
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            -0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, -0.5, 1.0, 0.0
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
        var texture0 = gl.createTexture();
        var texture1 = gl.createTexture();
        var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
        var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
        var image0 = new Image();
        var image1 = new Image();
        image0.src = '../../resources/sky.jpg';
        image0.onload = ()=>{
            loadTexture(texture0, u_Sampler0, image0, 0);
        }
        image1.src = '../../resources/circle.gif';
        image1.onload = ()=>loadTexture(texture1, u_Sampler1, image1, 1);
        return true;
    }
    var texUnit0 = false, texUnit1 = false; 
    function loadTexture(textTure, u_Sampler, image, unit){
        console.log(unit);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        if ( unit === 0 ){
            gl.activeTexture(gl.TEXTURE0);
            texUnit0 = true;
        } else if ( unit === 1 ) {
            gl.activeTexture(gl.TEXTURE1);
            texUnit1 = true;
        }
        gl.bindTexture(gl.TEXTURE_2D, textTure);
        // 配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(u_Sampler, unit);
        if ( texUnit0 && texUnit1 ){
            console.log('draw');
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
   
}
