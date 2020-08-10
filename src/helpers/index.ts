function exponentialRound (value: number, decimalCount: number) {
  return Number(`${Math.round(Number(`${value}e${decimalCount}`))}e-${decimalCount}`);
}

function getFractionDigitsNumber (value: number) {
  return value.toString().split('.')[1]?.length || 0;
}

function getRandomColor () {
  const hexValues = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexValues[Math.floor(Math.random() * 16)];
  }
  return color;
}

export { exponentialRound, getFractionDigitsNumber, getRandomColor };
