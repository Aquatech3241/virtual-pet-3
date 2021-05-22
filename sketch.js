var dog,happyDog;
var database;
var foodS,foodStock;

var addFood,feedDog;
var fedTime, lastFed

var gameState, readgameState;

var bedroom, garden, washroom;

var foodObj;

function preload()
{
Dog = loadImage("images/dogImg.png");
happyDog = loadImage("images/dogImg1.png");

bedroom = loadImage('images/Bed Room.png');
washroom = loadImage('images/Wash Room.png');
garden = loadImage('images/Garden.png');

}

function setup() {
	createCanvas(500, 500);
  database = firebase.database();
  foodObj = new Food();
  dog = createSprite(400,250,250,250);
  dog.addImage(Dog);

  dog.scale = 0.1

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed the Dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(500,95);
  addFood.mousePressed(addFoods);

  readgameState = database.ref('gameState')
  readgameState.on('value',function (data){
    gameState = data.val();
  })
  
}


function draw() {  
  background(46,139,87);

  currentTime = hour();
  if(currentTime ===(lastFed+1)){
    update('playing');
    foodObj.garden();
  }

  else if(currentTime ===(lastFed+2)){
    update('sleeping');
    foodObj.bedroom();
  }
  else if(currentTime >(lastFed+2)&&currentTime<=(lastFed+4)){
    update('bathing');
    foodObj.washroom();
  }

  else{
    update('hungry');
    foodObj.display();
  }

  if(gameState!=='hungry'){
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  else{
    feed.show();
    addFood.show();
    dog.addImage(Dog);
  }
  

  drawSprites();

}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState : 'hungry'
  })
}


function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x)
{

  if(x<=0){
    x=0;
  }else{
    x=x-1
  }
  
  database.ref('/').update({
    Food:x
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}



