var VexShader = 
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main(){\n' + 
    'gl_Position = a_Position * u_ModelMatrix;\n' + 
    '}';
var FragShader = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) ;\n' +
    '}';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VexShader, FragShader);
    var angle = -Math.PI / 6;
    var cosB = Math.cos(angle);
    var sinB = Math.sin(angle);
    // cosB -sinB 0 0 
    // sinB cosB 0 0 
    // 0 0 1 0
    // 0 0 0 1
    // initVerTexShaders(gl, vexShader, vexFragment);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // var matrix = new Float32Array([
    //     cosB, sinB, 0.0, 0.0,
    //     -sinB, cosB, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);
    var matrix = new Matrix4();
    // matrix.setRotate(30, 0, 0, 1);
    // matrix.translate(0.5, 0, 0);
    matrix.setTranslate(0.5, 0, 0);
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
            0.0, 0.5, -0.5, -0.5, 0.5, -0.5
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