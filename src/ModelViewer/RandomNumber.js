export const getRandomIntInclusive = (min, max) => {
   return Math.floor(Math.random() * (max-min+1) + min);
}

export const getRandomNumber = (min, max) => {
   return Math.random() * (max - min) + min;
}
