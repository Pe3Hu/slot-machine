class Card {
   constructor (index, value, color, grid, size){
      this.index = index ? index : 0;
      this.value = value ? value : "1";
      this.color = color ? color : "red";
      this.grid = grid ? grid : new THREE.Vector2(0,0);
      this.size = size ? size : new THREE.Vector2(25,35);
      this.name = this.value+this.color;
      this.open = false;
      /*var color = new THREE.Color(this.color);
      color.setHSL(colorHelper[this.grid.y], 1, 0.5);
      var Geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, 0);
      var Material = new THREE.MeshBasicMaterial({transparent: true, opacity: 1,
      color: color,   side: THREE.DoubleSide, wireframe : true});*/
      var suit = 5;
      var value = Number(this.value);
      value++;
      value.toString();
      var txtValue = "image_part_00"+value;
      var txtColor = this.color+"/";
      var txtSuit = "suit"+suit.toString();

      var materialArray = [];
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/'+txtColor+txtValue+'-min.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/'+txtColor+txtValue+'-min.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/'+txtColor+txtValue+'-min.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/'+txtColor+txtValue+'-min.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/'+txtColor+txtValue+'-min.jpg' ) }));
      materialArray.push(new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( 'src/textures/suits/'+txtSuit+'-min.jpg' ) }));


      var Material = new THREE.MeshFaceMaterial(materialArray);
      var Geometry = new THREE.CubeGeometry( this.size.x, this.size.y, 0.1, 1, 1, 1, materialArray );

      this.mesh = new THREE.Mesh(Geometry, Material);
      this.mesh.position.set(
        this.grid.x*this.size.x,
        this.grid.y*this.size.y,
        0
      );
      this.mesh.name = this.index;//this.value+this.color;
    }

    flip(){
      this.open = false;
   }
}
