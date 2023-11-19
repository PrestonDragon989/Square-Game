class Utils {
    getVector(pointA, pointB) {
        //Getting Vector Info
        vectorX = pointB[0] - pointA[0];
        vectorY = pointB[1] - pointA[1];

        //Making Vector
        vector = {x: vectorX, y: vectorY};

        //Returning Vector
        return vector;
    }
    
    //Random Number Between min and max
    randint(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }
}

//Exporting Utils to All of the Good boys and girls of this world who need it <3
export { Utils };