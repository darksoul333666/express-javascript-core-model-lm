import fs from 'fs';
const generateStringArray = () => {
    const filePath = '../../camaras.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo

  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const result = [];

  let currentString = '';

  for (const line of lines) {
    if (line.startsWith('Sku')) {
      if (currentString !== '') {
        result.push(currentString.replace(/\n/g, '').replace(/\.{2,}/g, '.'));
        currentString = '';
      }
    }

    currentString += line.trim();

    if (line.endsWith('Sku')) {
      result.push(currentString.replace(/\n/g, '').replace(/\.{2,}/g, '.'));
      currentString = '';
    }
  }

  return result;
};

// Ejemplo de uso

// const stringArray = generateStringArray(filePath);
// console.log(stringArray);

export default generateStringArray