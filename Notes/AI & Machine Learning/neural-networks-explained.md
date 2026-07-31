---
title: "Neural Networks Explained (3Blue1Brown)"
source: "https://www.youtube.com/watch?v=aircAruvnKk"
platform: youtube
date_saved: 2026-07-25
date_processed: 2026-07-26
category: AI & Machine Learning
tags: [neural-networks, deep-learning, 3blue1brown, machine-learning, backpropagation, gradient-descent, sigmoid, relu, mnist, digit-recognition, math, visual-explanation, beginner, introduction, computational-graph]
rating: worth-deep-reading
author: "3Blue1Brown (Grant Sanderson)"
---

## Summary

Grant Sanderson's classic 3Blue1Brown video provides a visual, math-first introduction to how neural networks work, using handwritten digit recognition (MNIST) as the running example. The video walks through the structure of a neural network — layers, neurons, weights, biases, and activation functions — building up to a network that can classify 28×28 pixel images of digits. It covers the difference between sigmoid and ReLU activation functions, motivated by biological analogy but chosen for practical training benefits. The companion video covers the learning/backpropagation side.

## Key Takeaways

- **Neurons are simple**: A neuron holds a single number between 0 and 1 (its activation). The network starts with 784 input neurons (one per pixel in a 28×28 image) and ends with 10 output neurons (one per digit)
- **Layers matter**: Hidden layers between input and output are where the real computation happens — each layer detects increasingly abstract features (edges → patterns → digit parts)
- **Activation functions**: Early networks used sigmoid (squishing values to 0–1), but modern networks use ReLU (max(0, x)) because it trains significantly faster — this was a practical discovery, not a theoretical one
- **Weights and biases**: Each connection has a weight, each neuron has a bias — learning means adjusting these numbers so the network's outputs match the correct answers
- **Learning is the hard part**: This video covers structure only; the actual "learning" via gradient descent and backpropagation is in the follow-up video

## My Notes

Excellent starting point for understanding neural networks from first principles. The visual approach makes the math intuitive. Watch the follow-up video on backpropagation to complete the picture.

## Related
- [[distributionally-robust-receive-combining]] — ML research
- [[langchain]] — ML framework
- [[Brinicle-Resource-Efficient-Vector-Index]] — Applied neural networks
- [[Llama-cpp-Optimization-Tool-30B-on-6GB-VRAM]] — Neural network inference
