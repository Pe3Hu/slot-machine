class Deck {
   constructor ( offset ){
     this.offset = offset ? offset : new THREE.Vector3(25/2, 35/2, 0);
     this.values = ['1', '2', '3', '4', '5', '6', '7'];
     this.colors = ['red','orange','yellow','green', 'aqua', 'blue', 'violet'];//ROYGABV
     this.cards = [];
     this.deck = [];
     this.hands = [[], []];
     this.palettes = [[], []];
     this.offsets = [
       new THREE.Vector3(0, -4*cardSize.y, 0),
       new THREE.Vector3(-cardSize.x, -4*cardSize.y, 0)
     ];
     this.offsets[0].add(this.offset);
     this.offsets[1].add(this.offset);

       for( var c = 0; c < this.colors.length; c++ )  {
           for( var v = 0; v < this.values.length; v++ ) {
               var index = c*this.colors.length+v;
               var grid = new THREE.Vector2(c, v);
               this.cards.push( new Card( index, this.values[v], this.colors[c], grid ) );
               this.deck.push(index);
           }
       }
     this.reset = [];
    }

    show(scene){
      for( var i = 0; i < this.cards.length; i++ ){
          this.cards[i].mesh.position.add(this.offset);
          targetList.push(this.cards[i].mesh);
          scene.add(this.cards[i].mesh);
      }
    }

    set(n){
      for( var i = 0; i < n; i++ ){
        var randLeft  = Math.floor(Math.random() * this.deck.length);
        var obj = this.deck.splice(randLeft, 1);
        this.hands[0].push(obj);
        this.cards[obj].mesh.position.set(
          this.offsets[0].x+this.hands[0].length*this.cards[obj].size.x,
          this.offsets[0].y,
          this.offsets[0].z
        );
      }

      for( var i = 0; i < n; i++ ){
        var rightLeft  = Math.floor(Math.random() * this.deck.length);
        var obj = this.deck.splice(rightLeft, 1);
        this.hands[1].push(obj);
        this.cards[obj].mesh.position.set(
          this.offsets[1].x-this.hands[1].length*this.cards[obj].size.x,
          this.offsets[1].y,
          this.offsets[1].z
        );
      }
    }

    getName(n){
      var value = this.values[this.cards[n].grid.y];
      var color = this.colors[this.cards[n].grid.x];
      return value+color;
    }

    printHands(){
      for (var i=0; i<this.hands.length; i++){
        if (i==1)
          console.log("Left")
        else
          console.log("Right")
        for (var j=0; j<this.hands[i].length; j++){
          console.log(this.getName(this.hands[i][j]));
        }
      }
    }
}
