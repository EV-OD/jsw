export class Model {
  weights: number[][][];
  biases: number[][];
  constructor(weights: number[][][], biases: number[][]) {
    this.weights = weights;
    this.biases = biases;
  }
}

let seedTrain: number = 323455789;

function random1(): number {
  // should return between 0 and 1
    "use wasm";
    let s = <i32>seedTrain;
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    seedTrain = <f64>s;
    return <f64>(s % 10000) / 10000.0;
}

function max1(a: number, b: number): number {
    "use wasm";
    return a > b ? a : b;
}

export function trainModelWasm(data: number[][], labels: number[][], epochs: number, learningRate: number): Model {
    "use wasm";
    let layerArchitecture = [data.length > 0 ? data[0].length : 0, 5, labels.length > 0 ? labels[0].length : 0];
    let weights: number[][][] = [];
    let biases: number[][] = [];

    // Initialize weights and biases
    for (let i = 0; i < layerArchitecture.length - 1; i++) {
        let layerWeights: number[][] = [];
        let layerBiases: number[] = [];
        for (let j = 0; j < layerArchitecture[i + 1]; j++) {
            let neuronWeights: number[] = [];
            for (let k = 0; k < layerArchitecture[i]; k++) {
                neuronWeights.push(random1() * 0.01);
            }
            layerWeights.push(neuronWeights);
            layerBiases.push(0);
        }
        weights.push(layerWeights);
        biases.push(layerBiases);
    }

    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let sampleIndex = 0; sampleIndex < data.length; sampleIndex++) {
            let input = data[sampleIndex];
            let target = labels[sampleIndex];
            
            // Forward pass
            let activations: number[][] = [input];
            for (let layer = 0; layer < weights.length; layer++) {
                let layerInput = activations[layer];
                let layerOutput: number[] = [];
                for (let neuron = 0; neuron < weights[layer].length; neuron++) {
                    let sum = biases[layer][neuron];
                    for (let weightIndex = 0; weightIndex < weights[layer][neuron].length; weightIndex++) {
                        sum += weights[layer][neuron][weightIndex] * layerInput[weightIndex];
                    }
                    // Using ReLU activation function
                    layerOutput.push(max1(0, sum));
                }
                activations.push(layerOutput);
            }

            // Backward pass (gradient descent)
            let output = activations[activations.length - 1];
            let outputErrors: number[] = [];
            for (let i = 0; i < output.length; i++) {
                let error = output[i] - target[i];
                let derivative = output[i] > 0 ? 1 : 0;
                outputErrors.push(error * derivative);
            }

            let currentDeltas = outputErrors;

            for (let layer = weights.length - 1; layer >= 0; layer--) {
                let inputActivations = activations[layer];
                let nextDeltas = new Array<number>(inputActivations.length);
                for(let i=0; i<nextDeltas.length; i++) nextDeltas[i] = 0;

                for (let neuron = 0; neuron < weights[layer].length; neuron++) {
                    let delta = currentDeltas[neuron];

                    // Update bias
                    biases[layer][neuron] -= learningRate * delta;
                    
                    for (let weightIndex = 0; weightIndex < weights[layer][neuron].length; weightIndex++) {
                        let inputVal = inputActivations[weightIndex];
                        nextDeltas[weightIndex] += weights[layer][neuron][weightIndex] * delta;
                        weights[layer][neuron][weightIndex] -= learningRate * delta * inputVal;
                    }
                }

                if (layer > 0) {
                     for(let i=0; i<nextDeltas.length; i++){
                         if (inputActivations[i] <= 0) nextDeltas[i] = 0;
                     }
                     currentDeltas = nextDeltas;
                }
            }
        }
    }
    return new Model(weights, biases);
}


export function predictWasm(input: number[], model: Model): number[] {
    "use wasm";
    let weights = model.weights;
    let biases = model.biases;
    let activations: number[] = input;

    for (let layer = 0; layer < weights.length; layer++) {
        let layerInput = activations;
        let layerOutput: number[] = [];
        for (let neuron = 0; neuron < weights[layer].length; neuron++) {
            let sum = biases[layer][neuron];
            for (let weightIndex = 0; weightIndex < weights[layer][neuron].length; weightIndex++) {
                sum += weights[layer][neuron][weightIndex] * layerInput[weightIndex];
            }
            // Using ReLU activation function
            layerOutput.push(max1(0, sum));
        }
        activations = layerOutput;
    }
    return activations;
}
