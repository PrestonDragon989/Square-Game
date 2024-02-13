// Vector for quick calculation
import Vector2 from "./vector.mjs";
import { mediumBlueAI, basicBlueAI, basicRedAI, complexRedAI, mediumRedAI } from "./AI.mjs";

// AI

class Utils {
    constructor() {
        //Getting Textbox
        this.textbox = document.getElementById("text-box");
        this.speakerbox = document.getElementById("speaker-box");
        this.textboxClicked = false;
        this.textboxActive = false;
        this.textboxQue = [];
        this.lastTextboxClick = Date.now();
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

    inRange(variable, min, max) {
        if (variable >= min && variable <= max) {
            return true;
        } else return false;
    }

    spawnRateIncrease(enemyList, min) {
        let rateIncrease;

        if (enemyList.length === 0) rateIncrease = 2000;
        else if (enemyList.length === 1) rateIncrease = 2000;
        else if (enemyList.length === 2) rateIncrease = 1000;
        else if (enemyList.length === 4) rateIncrease = 800;
        else if (enemyList.length === 5) rateIncrease = 600;
        else if (enemyList.length === 8) rateIncrease = 500;
        else if (enemyList.length === 9) rateIncrease = 400;
        else if (enemyList.length === 10) rateIncrease = 300;
        else if (enemyList.length === 11) rateIncrease = 200;
        else if (enemyList.length === 12) rateIncrease = 100;
        else rateIncrease = 0;

        if (rateIncrease > min) rateIncrease = min - 2;

        return rateIncrease;
    }

    rectIntersect(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    convertAI(AI, rect, HP, speed, contactDamage, bulletDamage, player, canvas) {
        if (AI == "basicRedAI") return new basicRedAI(rect, HP, speed, contactDamage, bulletDamage, player, canvas);
        else if (AI == "mediumRedAI") return new mediumRedAI(rect, HP, speed, contactDamage, bulletDamage, player, canvas);
        else if (AI == "complexRedAI") return new complexRedAI(rect, HP, speed, contactDamage, bulletDamage, player, canvas);
        else if (AI == "basicBlueAI") return new basicBlueAI(rect, HP, speed, contactDamage, bulletDamage, player, canvas);
        else if (AI == "mediumBlueAI") return new mediumBlueAI(rect, HP, speed, contactDamage, bulletDamage, player, canvas);
    }

    spawnEnemy(enemyClass, type = "basic") {
        let colors = ["Red"];
        if (type === "basic") colors = ["Red", "Blue"];
        else if (type === "medium") colors = ["Red", "Blue"];
        else if (type == "complex") colors = ["Red"];
        let color = colors[this.randint(0, colors.length)];
        enemyClass.spawnEnemy([null, null], 400, enemyClass.basicEnemyData[`${type}${color}Enemy`], [true, 3, 4], `${type}${color}AI`)
    }

    getDistance(pointA, pointB) {
        const deltaX = pointB[0] - pointA[0];
        const deltaY = pointB[1] - pointA[1];
    
        // Applying the distance formula
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    
        return distance;
    }

    getAngleBetween(x1, y1, x2, y2, convertToDegrees) {
        let calc_angle = Math.atan2 ( y2 - y1 , x2 - x1 );
        if ( calc_angle < 0 ) { // Removing negative angles
            calc_angle += Math.PI * 2;
        }
        let convertDegrees = 1;
        if (convertToDegrees == true) convertDegrees = ( 180 / Math.PI );

        return calc_angle * convertDegrees;
    }

    calculateNewPoint(originalPosition, slope, totalDistance) {
        // Extracting x and y from originalPosition
        let [x, y] = originalPosition;
      
        // Calculate the new position until the distance is equal to totalDistance
        while (this.getDistance(originalPosition, [x, y]) <= totalDistance) {
          x += 1; // You can modify this to suit your needs
          y += slope * x + originalPosition[1];
        }
      
        return [x, y];
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
        // Main Text Box
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

        // Speaker Box
        // Cancel right click window
        this.speakerbox.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        
        // Checking Click
        this.speakerbox.addEventListener('mousedown', (event) => {
            this.textboxClicked = true;
        });
        
        this.speakerbox.addEventListener('mouseup', (event) => {
            this.textboxClicked = false;
        });
    }    

    updateTextbox() {
        let timeElapsed = Date.now() - this.lastTextboxClick 
        if (this.textboxClicked & this.textboxActive & timeElapsed >= 300) {
            this.textboxActive = false;
            this.speakerbox.style.left = "200%";
            this.textbox.style.left = "200%";
            if (this.textboxQue.length > 0) {
                this.displayText(this.textboxQue[0][0], this.textboxQue[0][1]);
                // Removing First Item in the list
                this.textboxQue.splice(this.textboxQue[0]);
            }
            this.lastTextboxClick = Date.now();
        }
    }

    goThroughQue() {
        if (this.textboxQue.length > 0) {
            this.displayText(this.textboxQue[0][0], this.textboxQue[0][1]);
            // Removing First Item in the list
            this.textboxQue.splice(this.textboxQue[0]);
        }
    }

    displayText(text, speaker = null) {
        this.lastTextboxClick = Date.now();
        this.textboxClicked = false;
        this.textboxActive = true;
        this.textbox.style.left = "20%";
        this.textbox.innerHTML = text;
        if (speaker != null) {
            this.speakerbox.style.left = "20%";
            this.speakerbox.innerHTML = speaker;
        }
    }

    displayTextQue(text, speaker = null) {
        this.textboxQue.push([text, speaker]);
    }
}

//Exporting Utils to All of the Good boys and girls of this world who need it <3
export default Utils;