
import { add, factorial, normalJS } from './source.compiled.js';

console.log('Running tests...');
try {
    console.log('add(2, 3) =', add(2, 3));
    console.log('factorial(5) =', factorial(5));
    console.log('normalJS(10) =', normalJS(10));
} catch (e) {
    console.error(e);
}
