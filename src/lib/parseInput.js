export default function parseInput(type, value, def) {
  switch (type) {
    case 'integer':
      value = parseFloat(value);
      value = isNaN(value) ? def : value;
      value = Math.round(value);
      return value;
    case 'float':
      value = parseFloat(value);
      value = isNaN(value) ? def : value;
      return value;
  }
}
