var dog,happyDog;
var database;
var foodS,foodStock;

var addFood,feedDog;
var fedTime, lastFed

var foodObj;

function preload()
{
Dog = loadImage("images/dogImg.png");
happyDog = loadImage("images/dogImg1.png");
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
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  

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
    FeedTime:hour()
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


