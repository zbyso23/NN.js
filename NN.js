NN = function() //Backpropagation
{
	var inputSize;
	var inputWeights;

	var bias;
	var learningRate;
	var iterations;
	var error;

	var outputSize;
	var output;

	//cheetah: I 10, E 0.03, smarty: I 20, E 0.003, genius: I 40, E 0.003, B 0.2, L 0.8
	var DEFAULT_ITERATIONS = 40; 
	var DEFAULT_ERROR      = 0.003;

	var __construct = function(inputSize, outputSize, bias, learningRate) {
		bias = bias || 0.2;
		learningRate = learningRate || 0.8
		inputSize    = Math.max(inputSize.length, 1);
		outputSize   = Math.max(outputSize.length, 1);
		bias         = parseFloat(bias);
		learningRate = parseFloat(learningRate);
		inputWeights = [];

		error        = DEFAULT_ERROR;
		iterations   = DEFAULT_ITERATIONS;

		initialize();
	}

	var setIterations = function(iterationsSet) 
	{
		iterations = iterationsSet;
	}

	var setError = function(errorSet) 
	{
		error = errorSet;
	}

	var run = function(input) 
	{
		if(input.length !== inputSize) 
		{
			throw new Error('Invalid input size!');
		}
		var output = [];
		for(var j=0; j < outputSize; j++) 
		{
			sum = bias;
			for(var i=0; i < inputSize; i++) 
			{
				sum += inputWeights[i][j] * input[i];
			}
			output[j] = getActivation(sum);
		}
		return output;
	}

	var train = function(input, output) 
	{
		var inputLen  = input.length;
		var outputLen = output.length;
		var iteration = 0;
		do 
		{
			var result    = run(input);
			var errorTrain     = 0;
			for(var j=0; j < outputSize; j++) 
			{
				errorTrain += Math.abs(output[j] - result[j]);
			}
			errorTrain = errorTrain / outputSize;

			for(var i=0; i < this->inputSize; i++) 
			{
				for(var j=0; j < outputSize; j++) 
				{
					inputWeights[i][j] += learningRate * (output[j] - result[j]) * input[i];
				}
			}
		} while(errorTrain > error && iteration++ < iterations);
	}

	var trainSet = function(trainSet) 
	{
		trainLen = trainSet.length * 250;
		for(var i=0; i < trainLen; i++) 
		{
			//@todo
			// trainData = trainSet[array_rand(trainSet)];
			// this->train(trainData[0], trainData[1]);
		}
	}

	var runSet = function(runSet) 
	{
		var outputs = [];
		var runLen  = runSet.length;
		for(var i=0; i < runLen; i++) 
		{
			outputs[i] = run(runSet[i][0]);
		}
		return outputs;
	}

	var initialize = function() {
		for(var i=0; i < inputSize; i++) 
		{
			if(inputWeights.indexOf(i) === -1) inputWeights[i] = [];
			for(var j=0; j < outputSize; j++) 
			{
				inputWeights[i][j] = getRandomWeight();
			}
		}
	}

	var _getOutput = function() 
	{
		return output;
	}

	var _run = function(input);

	var _train = function(input, output);

	var save = function() 
	{
		return JSON.stringify({
			'inputSize'    : inputSize,
			'outputSize'   : outputSize,
			'bias'         : bias,
			'learningRate' : learningRate,
			'inputWeights' : inputWeights,
			'error'        : error,
			'iterations'   : iterations
		});
	}

	var load = function(json) 
	{
		$nn = JSON.parse(json, true);
		if(false === $nn) {
			throw new Exception('Invalid JSON for load!');
		}
		$requiredKeys = array(
			'inputSize', 'outputSize', 'bias', 'learningRate', 'inputWeights', 'error', 'iterations'
		);
		foreach($requiredKeys as $requiredKey) {
			if(false === array_key_exists($requiredKey, $nn)) {
				throw new Exception("Invalid JSON structure: missing key '{$requiredKey}'!");
			}
		}
		$this->inputSize    = $nn['inputSize'];
		$this->outputSize   = $nn['outputSize'];
		$this->bias         = $nn['bias'];
		$this->learningRate = $nn['learningRate'];
		$this->inputWeights = $nn['inputWeights'];
		$this->error        = $nn['error'];
		$this->iterations   = $nn['iterations']; 
	}


	var getRandomWeight = function() 
	{
		return Math.random(0,1000000000) / 1000000000;
	}

	var getActivation = function(sum) 
	{
		return ( 2 / (1 + Math.exp(-sum) ) ) - 1;
	}


	return {
		train: _train,
		run: _run,
		getOutput: _getOutput
	}
}

/*
Class Backpropagation extends ANeuralNetwork {

	public function train(Array $input, $output) {
		$inputLen = count($input);
		$outputLen = count($output);
		$iteration = 0;
		do {
			$result    = $this->run($input);
			$error     = 0;
			for($j=0; $j < $this->outputSize; $j++) {
				$error += abs($output[$j] - $result[$j]);
			}
			$error = $error / $this->outputSize;

			for($i=0; $i < $this->inputSize; $i++) {
				for($j=0; $j < $this->outputSize; $j++) {
					$this->inputWeights[$i][$j] += $this->learningRate * ($output[$j] - $result[$j]) * $input[$i];
				}
			}
		} while($error > $this->error && $iteration++ < $this->iterations);
	}


	public function load($json) {
		$nn = json_decode($json, true);
		if(false === $nn) {
			throw new Exception('Invalid JSON for load!');
		}
		$requiredKeys = array(
			'inputSize', 'outputSize', 'bias', 'learningRate', 'inputWeights', 'error', 'iterations'
		);
		foreach($requiredKeys as $requiredKey) {
			if(false === array_key_exists($requiredKey, $nn)) {
				throw new Exception("Invalid JSON structure: missing key '{$requiredKey}'!");
			}
		}
		$this->inputSize    = $nn['inputSize'];
		$this->outputSize   = $nn['outputSize'];
		$this->bias         = $nn['bias'];
		$this->learningRate = $nn['learningRate'];
		$this->inputWeights = $nn['inputWeights'];
		$this->error        = $nn['error'];
		$this->iterations   = $nn['iterations']; 
	}

	public function saveFile($filename) {
		$nnJson = $this->save();
		$result = file_put_contents($filename, $nnJson);
		if(false === $result) {
			throw new Exception("Saving NN failed - unable writing file {$filename}!");
		}
	}

	public function loadFile($filename) {
		$nnJson = file_get_contents($filename);
		if(false === $nnJson) {
			throw new Exception("Loading NN failed - unable reading file {$filename}!");
		}
		$this->load($nnJson);
	}

}
*/