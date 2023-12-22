// Vector for quick calculation
import Vector2 from "./vector.mjs";

// AI

class Utils {
    constructor() {
        this.utils = true;
        this.isThis = "This is, in fact, the Utils Class!"

        //Getting Textbox
        this.textbox = document.getElementById("text-box");
        this.textboxClicked = false;
    }
    
    //Random Number Between min and max
    randint(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    
    randFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    getJson(filePath) {
        return new Promise((resolve, reject) => {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${filePath}. Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(jsonData => {
                    resolve(jsonData);
                })
                .catch(error => {
                    console.error(`Error fetching or parsing the JSON file (${filePath}):`, error);
                    reject(error);
                });
        });
    }

    range(start, end, step = 1) {
        const result = [];
        
        if (step > 0) {
            for (let i = start; i < end; i += step) {
                result.push(i);
            }
        } else if (step < 0) {
            for (let i = start; i > end; i += step) {
                result.push(i);
            }
        } else {
            console.error("Step must not be zero.");
        }
    
        return result;
    }

    rectIntersect(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    convertAI(AI, rect, HP, speed, contactDamage, bulletDamage) {
        if (AI == "basicRedAI") return new basicRedAI(rect, HP, speed, contactDamage, bulletDamage);
    }

    getDistance(pointA, pointB) {
        const deltaX = pointB[0] - pointA[0];
        const deltaY = pointB[1] - pointA[1];
    
        // Applying the distance formula
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    
        return distance;
    }

    calcPercentage(value, total) {
        // Ensure both parameters are numbers
        if (typeof value !== 'number' || typeof total !== 'number') {
            throw new Error('Both parameters must be numbers');
        }
    
        // Avoid division by zero
        if (total === 0) {
            throw new Error('Total cannot be zero');
        }
    
        // Calculate the percentage
        const percentage = (value / total) * 100;
    
        return percentage;
    }


    // Textbox Functions
    textboxDetectClick() {
        // Cancel right click window
        this.textbox.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        
        // Checking Click
        this.textbox.addEventListener('mousedown', (event) => {
            this.textboxClicked = true;
        });
        
        this.textbox.addEventListener('mouseup', (event) => {
            this.textboxClicked = false;
        });
    }    

    updateTextbox() {
        if (this.textboxClicked) {
            
        }
    }
}

//Exporting Utils to All of the Good boys and girls of this world who need it <3
export default Utils;