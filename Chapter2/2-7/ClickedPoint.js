var VexShader = 
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' + 
    'gl_Position=a_Position;\n' + 
    'gl_PointSize=a_PointSize;\n' +
    '}';
var FragShader = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor ;\n' +
    '}';
function main(){
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    console.log(gl);
    initShaders(gl, VexShader, FragShader);
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.vertexAttrib1f(a_PointSize, 40.0);
    console.log(a_Position);
    console.log(a_PointSize);
    var points = [];
    var colors = [];
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    canvas.onmousedown = function(event){ handleMouseDown(event) };
    function handleMouseDown(event){
        let x= event.clientX;
        let y = event.clientY;
        var rect = canvas.getBoundingClientRect();
        x = ( x - rect.left - rect.width /2 ) / ( rect.width / 2);
        y = ( rect.height /2 - ( y - rect.top ) ) / ( rect.height / 2 );
        console.log(x,y);
        // console.log(gl.program);
        // 每次绘制之后，颜色缓冲区就被WEBGL重置为默认颜色(0.0, 0.0, 0.0, 0.0);
        // gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        points.push({ x, y});
        if ( x >= 0.0 && y >= 0.0 ){
            colors.push([1.0, 0.0, 0.0, 1.0]);
        } else if ( x > 0.0 && y < 0.0 ) {
            colors.push([0.0, 1.0, 0.0, 1.0]);
        } else {
            colors.push([0.0, 0.0, 1.0, 1.0]);
        }
        for( var i=0;i<points.length;i++) {
            let point = points[i];
            var color = colors[i];
            gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0);
            gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3] );
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }

   
    // gl.drawArrays(gl.POINTS, 0, 1);
}