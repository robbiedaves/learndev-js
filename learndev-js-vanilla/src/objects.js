import { addToIndexHTML } from './output.js'

export function runObjects() {

  var person = {
    firstName:"Robin",
    lastName:"Davies",
    age:50
  };

  // Different ways to access person
  addToIndexHTML(person.firstName + " " + person.lastName + "  aged: " + person.age);
  addToIndexHTML(person["firstName"] + " " + person["lastName"] + "  aged: " + person["age"]);

  // Add a property:
  person.email = "rob@mail.com";
  addToIndexHTML(person.firstName + " " + person.lastName + "  aged: " + person.age +" " + person.email);

  // Access each property in person
  for (var key in person) {
    addToIndexHTML(person[key]);
  }


  // methods

  // Adding a method to an Object
  person.fullName = function() {return this.firstName + " " + this.lastName;};
  addToIndexHTML("Full Name: " + person.fullName()); // with (), returns the result of fullName
  addToIndexHTML("Full Name: " + person.fullName); // without (), returns the function

  // Constructors
  function Animal(type, numberOfLegs, colour) {
    this.type = type;
    this.numberOfLegs = numberOfLegs;
    this.colour = colour;
    this.desciption = function() {
      return "Animal Type: " + this.type + "  No of legs: " + this.numberOfLegs + "  Colour: " + this.colour;
    }
  }

  var dog = new Animal("Dog", 4, "black");
  var bird = new Animal("Eagle", 2, "brown");
  addToIndexHTML(dog.type + " " + dog.numberOfLegs + " " + dog.colour);
  addToIndexHTML(bird.type + " " + bird.numberOfLegs + " " + bird.colour);
  addToIndexHTML("Descirption: " + bird.desciption());

  // Prototypes

  // If you want to add a function to a prototype, but not in the constructor
  // you need to use the prototype to add it
  // You can add properties and methods using the prototype
  Animal.prototype.size = "small";

  Animal.prototype.talk = function() {
    return "I'm talking";
  };

  addToIndexHTML(dog.talk() + " and my size is: " + dog.size);


}
