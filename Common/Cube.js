
function Cube( vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cube-vertex-shader";
    var fragShdr = fragmentShaderId || "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    this.positions = { 
        values : new Float32Array([
          0.0,0.0,0.0,
           0.5,0.0,0.0,
           0.5,0.5,0.0,
           0.0,0.5,0.0,
            
           0.5,0.0,0.0,
           0.5,0.5,0.0,
           0.5,0.5,0.5,
           0.5,0.0,0.5,
            
			0.5,0.0,0.5,
           0.0,0.0,0.5,
           0.0,0.5,0.5,
           0.5,0.5,0.5,
            
			0.0,0.0,0.5,
			0.0,0.0,0.0,
			0.0,0.5,0.0,
			0.0,0.5,0.5,
			
           0.0,0.5,0.0,
           0.5,0.5,0.0,
           0.5,0.5,0.5,
           0.0,0.5,0.5,
            
           0.0,0.0,0.5,
           0.5,0.0,0.5,
           0.0,0.0,0.0,
           0.5,0.0,0.0,
            ]),
        numComponents : 3
    };
    
    this.indices = { 
        values : new Uint16Array([
           0,1,3,
           3,1,2,
            
           7,5,4,
           6,5,7,
            
           8,9,11,
           11,9,10,
            
           12,13,15,
           15,13,14,
            
           16,17,19,
           19,17,18,
            
           20,21,22,
           22,21,23,
        ])
    };
    this.indices.count = this.indices.values.length;

    
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

    MVLoc = gl.getUniformLocation( this.program, "MV" );

    this.MV = undefined;

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        gl.uniformMatrix4fv( MVLoc, gl.FALSE, flatten(this.MV) );

        // Draw the cube's base
        gl.drawElements( gl.TRIANGLES, this.indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};
