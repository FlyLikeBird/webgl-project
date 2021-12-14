var VexShader = 
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' + 
    'gl_Position=a_Position;\n' + 
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
    console.log(gl);
    initShaders(gl, VexShader, FragShader);
    // initVerTexShaders(gl, vexShader, vexFragment);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    console.log(a_Position);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var n = initVertexBuffer();
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

    

    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // 以顶点为起始点，逆时针方向绘制三角形来判断最后一条边;
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
            // 右上角为起始点
            // 0.5, 0.5, 
            // -0.5, 0.5, 
            // -0.5, -0.5, 
            // 左上角为起始点
            -0.5, 0.5,
            -0.5, -0.5,
            0.5, 0.5,
            -1.0, 0.0, 
            -1.0, -0.5 
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