import { decodeSlab, readSlab } from './talespire';

const exampleSlab = '```H4sIAAAAAAAACjv369xFJgZmBgYGgUWHGX9Pme/S4z7T7pZdoRojUCzUoTlb86ioz+KHr77rVr33BontTk44nxfD7rj55RyeqOPhGUxAsRQGMGDezvCEcQLbAaBxJxhgwIENRAIAg0JdKmgAAAA=```';

const slabBinaryData = decodeSlab(exampleSlab);
const slabData = readSlab(slabBinaryData);
// console.log(slabData);

const formattedElement = document.createElement('pre');
formattedElement.innerText = JSON.stringify(slabData, null, 2);
document.getElementById('content').append(formattedElement);
