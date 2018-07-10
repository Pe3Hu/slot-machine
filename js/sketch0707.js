var container, stats, raycaster, mouse;
var camera, scene, renderer, controls;

var dragIndex, targetList, deck;
var mark;
var cardSize = new THREE.Vector2(25,35);
var colorHelper = [0, 30/360, 60/360, 120/360, 180/360, 240/360, 270/360];
var colors12Helper = [], slotMeshs = [], slotValues = [], planes = [];
var SLOT_NUMBER = 7, SLOT_LENGTH = 8;
var offsetSlot = new THREE.Vector3(-cardSize.x*(SLOT_NUMBER+0.5),cardSize.y*4,0);
var rotateSpeed = Math.PI/1800;
var totalAngles = [], targets = [], victoryIndexs = [], lastAngles = [];
var ticks = 0;
var stopCount = 0;
var randomTime = 550;
var lastMove = false;

init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x909090 );
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 600 );
	scene.add( camera );
	var light = new THREE.PointLight( 0xffffff, 0.8 );
	camera.add( light );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

  var divisions = 1000, s = 25*divisions;
  var gridHelper = new THREE.GridHelper( s, divisions );
  gridHelper.rotateX(Math.PI/2)
  scene.add( gridHelper );

	game();

	controls = new THREE.OrbitControls( camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	container.appendChild( renderer.domElement );

	//
	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onMouseMove( event ) {

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseDown( event )		{
			// update the mouse variable
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );
			var intersects = raycaster.intersectObjects( targetList );

			if ( intersects.length > 0 )
			{
				var name = intersects[ 0 ].object.name;
				var r = rangePalette();
				if ( dragIndex===null  ){
						dragIndex = name;
						//console.log(dragIndex)
				}
				else if (r){
					//console.log(r);
					addPalette();
					dragIndex = null;
				}
				else
					dragIndex = null;
				//intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 );
				//intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
			}
		}
function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	controls.update();
	render();
}
function render() {
	renderer.render( scene, camera );

	spin(stopCount);

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	for ( var i = 0; i < intersects.length; i++ ){
		dragVec = intersects[i].point.clone();
	}
	if (null !== dragIndex){
			var x = dragVec.x;
			var y = dragVec.y;
			var z = dragVec.z;
			deck.cards[dragIndex].mesh.position.set(x,y,z);
		//checkPlace();
	}

}
function game(){
	dragIndex = null, targetList = [];
	mark = new THREE.Vector3();
	stopCount += Math.floor(Math.random()*randomTime);
	var index = -1;

	for (var i=0; i<11; i++){
		var color = new THREE.Color();
		color.setHSL(i*30/360, 1, 0.5);
		colors12Helper.push(color.clone());
	}
	for (var i=0; i<colors12Helper.length; i++){
		var geometry = new THREE.PlaneGeometry( cardSize.x, cardSize.y, 32 );
		var material = new THREE.MeshBasicMaterial( {color: colors12Helper[i].clone(), side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.set(-i*cardSize.x-cardSize.x/2, cardSize.y/2, 0);
		planes.push(plane);
		scene.add( planes[i] );
	}

	deck = new Deck();
	//deck.show(scene);
	//deck.set(4);

	for (var i=0; i<SLOT_NUMBER; i++){
		slotMeshs.push([]);
		slotValues.push([]);
		totalAngles.push(0);
		victoryIndexs.push(null);
		targets.push(new THREE.Vector3(
			i*cardSize.x+offsetSlot.x,
			offsetSlot.y,
			0
		));
		SLOT_LENGTH++;
		var angle = Math.PI*2/SLOT_LENGTH;
		var R = cardSize.y/2/Math.sin(angle/2);
		var r = R*Math.cos(angle/2);
		for (var j=0; j<SLOT_LENGTH; j++){
			index = Math.floor(Math.random()*deck.cards.length%7)+i*7;
			//index = (SLOT_LENGTH*i+j)%deck.cards.length;
			//slotMeshs[i].push(planes[rand].clone()); deck
			//index++;
			//index = index%deck.cards.length;
			//console.log(index);
			slotMeshs[i].push(deck.cards[index].mesh.clone())
			slotValues[i].push({
				name:deck.getName(index),
				grid: new THREE.Vector2(i, j)
			});
			slotMeshs[i][j].position.set(
				i*cardSize.x,
				r*Math.sin(angle*j),
				r*Math.cos(angle*j)
			);
			offsetSlot.z = -r;
			slotMeshs[i][j].position.add(offsetSlot);
			slotMeshs[i][j].rotateX(-angle*j);
			scene.add(slotMeshs[i][j]);
		}
	}
	startSpin();
}
function spin(n){
	if (ticks<n && !lastMove){
		//console.log(ticks, n);
		for (var i=0; i<slotMeshs.length; i++){
			var angle = Math.PI*2/slotMeshs[i].length;
			var R = cardSize.y/2/Math.sin(angle/2);
			var r = R*Math.cos(angle/2);
			offsetSlot.z = -r;
			for (var j=0; j<slotMeshs[i].length; j++){
				slotMeshs[i][j].position.set(
					i*cardSize.x,
					r*Math.sin(angle*j-totalAngles[i]),
					r*Math.cos(angle*j-totalAngles[i])
				);
				slotMeshs[i][j].position.add(offsetSlot);
				slotMeshs[i][j].rotation.set(-angle*j+totalAngles[i],0,0);
				totalAngles[i]+=rotateSpeed;
			}
		}
		ticks++;
	}
	else
		lastMove = true;

		//lastMove = true;
	if (lastMove && ticks == n){
		getScore();
		ticks++;
	}
	if (ticks==n+1) {
		stopSpin();
	}
	if (ticks==n+2){
		getScore();
		ticks++;
	}

}
function getScore(){
	for (var i=0; i<slotMeshs.length; i++){
		var minIndex = null;
		var min = Infinity;
		for (var j=0; j<slotMeshs[i].length; j++){
			var d = slotMeshs[i][j].position.distanceTo(targets[i]);
			//console.log(slotMeshs[i][j].position,	d,	targets[i]);
			var minusAngle = Math.PI*2/slotMeshs[i].length;
			var angle = slotMeshs[i][j].rotation.x;
			if(d < min){
				min = d;
				minIndex = j;
			}
		}
		victoryIndexs[i] = {index: minIndex, d: min};
		var A = slotMeshs[i][victoryIndexs[i].index].rotation.x;
		if (A>Math.PI)
			A = -Math.PI*2+slotMeshs[i][victoryIndexs[i].index].rotation.x;
		if (A>0)
			A-=minusAngle;
		lastAngles.push({angle: A, fixed: false});
		if (ticks==stopCount+2)
			console.log(slotValues[i][victoryIndexs[i].index].name);
	}
	//console.log(lastAngles);
}
function stopSpin(){
	var flag = true;
	for (var i=0; i<slotMeshs.length; i++){
		var angle = Math.PI*2/slotMeshs[i].length;
		var R = cardSize.y/2/Math.sin(angle/2);
		var r = R*Math.cos(angle/2);
		offsetSlot.z = -r;
		var d = lastAngles[i]-2*Math.PI;
		var sign = Math.sign(lastAngles[i].angle);
		if (!lastAngles[i].fixed){
			flag = false;
			for (var j=0; j<slotMeshs[i].length; j++){
				//console.log(lastAngles);
				slotMeshs[i][j].position.set(
					i*cardSize.x,
					r*Math.sin(angle*j-totalAngles[i]),
					r*Math.cos(angle*j-totalAngles[i])
				);
				slotMeshs[i][j].position.add(offsetSlot);
				slotMeshs[i][j].rotation.set(-angle*j+totalAngles[i],0,0);
				totalAngles[i]+=rotateSpeed;
				lastAngles[i].angle+=rotateSpeed;
				if (lastAngles[i].angle>0)
					lastAngles[i].fixed = true;
			}
		}
	}
	if (flag)
		ticks++;
}
function startSpin(){
	for (var i=0; i<slotMeshs.length; i++){
		var angle = Math.PI*2/slotMeshs[i].length;
		var R = cardSize.y/2/Math.sin(angle/2);
		var r = R*Math.cos(angle/2);
		totalAngles[i] = rotateSpeed*(Math.PI*2/rotateSpeed)*Math.random();
		offsetSlot.z = -r;
		for (var j=0; j<slotMeshs[i].length; j++){
			slotMeshs[i][j].position.set(
				i*cardSize.x,
				r*Math.sin(angle*j-totalAngles[i]),
				r*Math.cos(angle*j-totalAngles[i])
			);
			slotMeshs[i][j].position.add(offsetSlot);
			slotMeshs[i][j].rotation.set(-angle*j+totalAngles[i],0,0);
		}
	}
}
