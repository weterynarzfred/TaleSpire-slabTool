import { evaluate } from 'mathjs';

export default function parseInput(type, value, def, scope = {}) {
  value = value === undefined ? '' : value;
  switch (type) {
    case 'integer':
      value = evaluate(value, scope);
      value = isNaN(value) ? def : value;
      value = Math.round(value);
      return value;
    case 'float':
      value = evaluate(value, scope);
      value = isNaN(value) ? def : value;
      return value;
  }
}
