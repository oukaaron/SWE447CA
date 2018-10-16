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
             
            0.0, 0.0, 0.0,   
            0.5, 0.0, 0.0,  
            0.5, 0.5, 0.0,   
            0.0, 0.5, 0.0,   
            
         
            0.5, 0.0, 0.5,   
            0.0, 0.0, 0.5,   
            0.0, 0.5, 0.5,   
            0.5, 0.5, 0.5,   
            
           
            0.0, 0.5, 0.0,  
            0.5, 0.5, 0.0,  
            0.5, 0.5, 0.5,  
            0.0, 0.5, 0.5,  
            
           
            0.0, 0.0, 0.0,  
            0.5, 0.0, 0.0,  
            0.5, 0.0, 0.5,  
            0.0, 0.0, 0.5,  
            
            
            0.0, 0.0, 0.5,  
            0.0, 0.0, 0.0,  
            0.0, 0.5, 0.0,  
            0.0, 0.5, 0.5,  
            
           
            0.5, 0.0, 0.0,  
            0.5, 0.0, 0.5,  
            0.5, 0.5, 0.5,  
            0.5, 0.5, 0.0   
        ]),
        numComponents : 3
    };
	
	this.textures = {
		values : new Float32Array([
		//Front
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		//Back
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		//Top
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		//Bottom
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		//Left
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
		
		//Right		
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0
		]),
		numComponents : 2
	};
		   
    this.indices = { 
        values : new Uint16Array([
            0, 1, 2, 0, 2, 3,	    
            4, 5, 6, 4, 6, 7,       
            8, 9, 10, 8, 10, 11,    
            13, 12, 14, 14, 12, 15, 
            16, 17, 18, 16, 18, 19, 
            20, 21, 22, 20, 22, 23  
        ])
    };
    this.indices.count = this.indices.values.length;

	//Adding the Texture to the cube
	this.initTexture = function () {
		texture = gl.createTexture();
		texImage = new Image();
		texImage.onload = function () {
			handleLoadedTexture (texImage, texture);
		}		
		
		texImage.src = "dr_strange.png";		
	}
	
    
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );	
		this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );	
	
		//Adding the Texture
		this.initTexture();
	
		this.textures.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textures.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.textures.values, gl.STATIC_DRAW);
		this.textures.attributeLoc = gl.getAttribLocation(this.program, "aTextureCoord");
		gl.enableVertexAttribArray(this.textures.attributeLoc);
	
	
    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );	
   	
		this.uniforms = {
			MV : undefined,
			P : undefined,
			uSampler: gl.getUniformLocation(this.program, 'uSampler'),
			sampler : undefined
		};
	
    //MVLoc = gl.getUniformLocation( this.program, "MV" );
		this.uniforms.MV = gl.getUniformLocation(this.program, "MV");
		this.uniforms.P = gl.getUniformLocation(this.program, "P");
		this.uniforms.sampler = gl.getUniformLocation(this.program, "uSampler");

		this.MV = mat4(); // or undefined
		this.P = mat4();
		this.sampler = undefined;

    //this.MV = undefined;

    this.render = function () {
        gl.useProgram( this.program );		
        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );	    
		
				//Adding for Texture
				gl.bindBuffer(gl.ARRAY_BUFFER, this.textures.buffer);
				gl.vertexAttribPointer(this.textures.attributeLoc, this.textures.numComponents, gl.FLOAT, gl.FALSE, 0, 0);
				
		
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
        
				gl.uniformMatrix4fv( this.uniforms.MV, gl.FALSE, flatten(this.MV) );
				gl.uniformMatrix4fv( this.uniforms.P, gl.FALSE, flatten(this.P) );
		
				//Adding for Texture
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.uniform1i(this.uniforms.uSampler, 0);		
		
		
				gl.drawElements(gl.TRIANGLES, this.indices.values.length, gl.UNSIGNED_SHORT, 0);
    }
};

handleLoadedTexture = function (image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    //image = texture.image;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //if (isPowerOf2(image.width) && isPowerOf2(image.height)) 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
