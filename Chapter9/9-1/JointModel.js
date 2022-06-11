// TranslatedRotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' + // 逐顶点定义法向量
  'varying vec4 v_Color;\n' +
  'uniform mat4 u_ProjectMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' + 
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'void main() {\n' +
  ' gl_Position = u_ProjectMatrix * u_ViewMatrix * u_ModelMatrix * a_Position ;\n' +
  ' vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + 
  ' vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +
  ' vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  ' float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  ' v_Color = vec4( color.rgb * nDotL + vec3(0.1), color.a);\n' + 
  '}\n';
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' + 
  'void main() {\n' +
  ' gl_FragColor = v_Color;\n' +
  '}\n';

function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    
    var n = initVertexBuffer();
    function initVertexBuffer(){
        // var vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.8, -0.3, 0.6, -0.9]);
        // gl.TRIANGLE_STRIGN 和 gl.TRIANGLE_FAN渲染模式跟顶点次序有关;
        var vertices = new Float32Array([
          1.5, 10.0, 2.5, -1.5, 10.0, 2.5, -1.5,  0.0, 2.5,  1.5,  0.0, 2.5, // v0-v1-v2-v3 front
          1.5, 10.0, 2.5,  1.5,  0.0, 2.5,  1.5,  0.0,-2.5,  1.5, 10.0,-2.5, // v0-v3-v4-v5 right
          1.5, 10.0, 2.5,  1.5, 10.0,-2.5, -1.5, 10.0,-2.5, -1.5, 10.0, 2.5, // v0-v5-v6-v1 up
         -1.5, 10.0, 2.5, -1.5, 10.0,-2.5, -1.5,  0.0,-2.5, -1.5,  0.0, 2.5, // v1-v6-v7-v2 left
         -1.5,  0.0,-2.5,  1.5,  0.0,-2.5,  1.5,  0.0, 2.5, -1.5,  0.0, 2.5, // v7-v4-v3-v2 down
          1.5,  0.0,-2.5, -1.5,  0.0,-2.5, -1.5, 10.0,-2.5,  1.5, 10.0,-2.5  // v4-v7-v6-v5 back
        ]);
    
        // Normal
        var normals = new Float32Array([
          0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
          1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
          0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
         -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
          0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
          0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
        ]);
    
        // Indices of the vertices
        var indices = new Uint8Array([
           0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // up
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // down
          20,21,22,  20,22,23     // back
        ]);
        var n = 6;
        var vertexBuffer = gl.createBuffer();
        var normalBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        // 将缓冲区的顶点坐标写入a_Position;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        // 将法向量写入a_Normal;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);
        // 将顶点索引数据写入缓冲区对象
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        return indices.length;
    }
    let near = 0.0, far = 0.5;
    var modelMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let projectMatrix = new Matrix4();
    var normalMatrix = new Matrix4();
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    let currentAngle = 0;
    let angle_step = 15;
    let g_last = Date.now();
    viewMatrix.setLookAt(20, 16, 30, 0, 0, 0, 0, 1, 0);
    // console.log(modelMatrix);
    projectMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatrix.elements);
    // 模型变换矩阵和法向量相关的运算
    var g_modelMatrix = new Matrix4();
    var ANGLE_STEP = 3.0;
    var arm1Angle = 0.0;
    var arm2Angle = 0.0;
    function draw(){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var arm1Length = 10.0; // Length of arm1
        g_modelMatrix.setTranslate(0.0, -14.0, 0.0);
        g_modelMatrix.rotate(arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis
        
        // 渲染arm1
        normalMatrix.setInverseOf(g_modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        // 渲染arm2(旋转矩阵和平移矩阵交换次序，渲染结果完全不同)
        g_modelMatrix.translate(0.0, arm1Length, 0.0);
        g_modelMatrix.rotate(arm2Angle, 0.0, 0.0, 1.0);
        g_modelMatrix.scale(1.2, 1, 1.2);
        normalMatrix.setInverseOf(g_modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_ModelMatrix, false, g_modelMatrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
       
    }
   
    document.onkeydown = function(ev){
        switch (ev.keyCode) {
            case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
              if (arm2Angle < 135.0) arm2Angle += ANGLE_STEP;
              break;
            case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
              if (arm2Angle > -135.0) arm2Angle -= ANGLE_STEP;
              break;
            case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
              arm1Angle = (arm1Angle + ANGLE_STEP) % 360;
              break;
            case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
              arm1Angle = (arm1Angle - ANGLE_STEP) % 360;
              break;
            default: return; // Skip drawing at no effective action
        }
        // Draw the robot arm
        draw();
    }
    draw();
}
