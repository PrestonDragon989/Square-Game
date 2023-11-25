import Vector2 from "./vector.mjs";

class Utils {
    constructor() {
        this.utils = true;
        this.isThis = "This is, in fact, the Utils Class!"
    }
    
    //Random Number Between min and max
    randint(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }
    
      randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    getJson(jsonPath) {
        fetch(jsonPath)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          // Do something with the JSON data here
        })
        .catch(error => {
          console.error('Error fetching or parsing JSON file:', error);
        });
        }  
    }

//Exporting Utils to All of the Good boys and girls of this world who need it <3
export default Utils;