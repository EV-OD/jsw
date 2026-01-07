
let seed: number = 123456789;
function random(): number {
  // should return between 0 and 1
    seed = (1103515245 * seed + 12345) & 0x7fffffff;
    return (seed % 10000) / 10000;
}

function max(a: number, b: number): number {
    return a > b ? a : b;
}

function trainModelJs(data: number[][], labels: number[][], epochs: number, learningRate: number) {
    
    let layerArchitecture = [data[0].length, 5, labels[0].length];
    let weights: number[][][] = [];
    let biases: number[][] = [];

    // Initialize weights and biases
    for (let i = 0; i < layerArchitecture.length - 1; i++) {
        let layerWeights: number[][] = [];
        let layerBiases: number[] = [];
        for (let j = 0; j < layerArchitecture[i + 1]; j++) {
            let neuronWeights: number[] = [];
            for (let k = 0; k < layerArchitecture[i]; k++) {
                neuronWeights.push(random() * 0.01);
            }
            layerWeights.push(neuronWeights);
            layerBiases.push(0);
        }
        weights.push(layerWeights);
        biases.push(layerBiases);
    }
    let loss = 0;

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
                    layerOutput.push(max(0, sum));
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
                let nextDeltas = new Array(inputActivations.length).fill(0);
                
                for (let neuron = 0; neuron < weights[layer].length; neuron++) {
                    let delta = currentDeltas[neuron];
                    
                    for (let weightIndex = 0; weightIndex < weights[layer][neuron].length; weightIndex++) {
                        let inputVal = inputActivations[weightIndex];
                        nextDeltas[weightIndex] += weights[layer][neuron][weightIndex] * delta;
                        weights[layer][neuron][weightIndex] -= learningRate * delta * inputVal;
                    }
                    biases[layer][neuron] -= learningRate * delta;
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
    return { weights: weights, biases: biases };
}

function predictJs(input: number[], model: { weights: number[][][], biases: number[][] }): number[] {
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
            layerOutput.push(max(0, sum));
        }
        activations = layerOutput;
    }
    return activations;
}

export { trainModelJs, predictJs };



