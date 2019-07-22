

## Word Cloud

Live Demo: https://cloudbymegan.herokuapp.com/

### Introduction
For the most part, word clouds are not the most modern or aesthetically pleasing things. In addition to creating a word cloud that fit the specifications, I wanted to tackle some aesthetic issues such as minimizing the space between words and giving it a modern look (minimal and linear; no obliques or retro fonts). In addition, I wanted to utilize the client-side rendering, that React provides, to generate clouds in real time. 

### First Attempt: Bin Packing Problem
For my initial attempt, I noticed that all of the words could be represented as rectangles with different dimensions. If I were able to minimize the amount of white space left over between words, this would also ensure I was creating a word cloud with the smallest area. Thus, the problem I had to solve was how to optimally fit rectangles into a boundary area.

I struggled with this optimization problem, until upon further research, I realized that this was actually a well studied problem called the "Bin Packing Problem". It turns out this is an NP-hard problem, which meant that I was not going to be able to find a computationally usable solution. 

### Second Attempt: Not-so-hard Bin Packing Problem
The problem I now faced was: what kind of simplifications can I introduce to the problem to remove this from the NP-hard class? If I were able to relax some rules, perhaps I could still generate aesthetically pleasing clouds. These were some rules I tried: (1) Sort the words and divide into ten distinct font sizes; (2) Allow the font size to change within a range; (3) Add words randomly until it fit. 

However, with these modifications, I was still stuck with Bin Packing problem (1, 2) or I would have such high computation times that the cloud could not be generated in real time (3). In addition, with all of my modifications, I would still have the challenge of how to represent a patchwork of varying rectangles. The time and space complexity of checking if a rectangle overlaps any other rectangle already place is quite high.

### Third Attempt: My Solution
Here is the algorithm I use, which I will discuss in more detail below:

1. Start with an empty canvas

2. Place a word in the center

3. Place a second word next to this word

4. Fill up any leftover space with words (recursively)

5. Place another word next to this filled rectangle (recursively)


6. Fill up any leftover space (recursively)

7. Repeat

When I approached the problem in this fashion, I realized that I only had two problems to solve. If I had an empty rectangle, I had to fill it up with words. If I had already filled up a rectangular space, I had to expand it by placing another word next to it. Notice that any "leftover space" between words, was just another empty rectangle (just like the initial problem). This pattern clearly lent itself to a recursive solution. I created two mutually recursive functions that would alternately call the other one. The base case would occur when no more words would fit or we ran out of words.

Another important feature I added was mapping the word frequencies onto a logarithmic distribution. Initially, words that occurred five times, would be five font sizes larger than a word that occurred once. This made the word cloud very confusing to read, because very frequent words looked more or less the same as less frequent ones. By applying a logarithmic function, the most frequent words would be significantly larger than the rest of the words. This greatly increased the readability of the word cloud.

This solution turns out to be O(n) = n^2. This computation is completed every time the input text changes. For our small amount of words (limited to 9k characters), this was acceptable because the delay from computation was not very noticable. 

### Security and Edge Cases
In terms of security, I believe this web app is safe from malicious text. First, this is just a very simple client-side only application. All user input is processed in the client's browser and nothing is sent back to the server. In addition, React is known to be XSS safe, which means that any strings will be escaped. In addition, our singular user input is immediately stripped of any characters that are not digits or letters, before getting written onto the canvas.
In terms of edge cases, empty inputs are accepted and large inputs are limited to 9k characters.

### Improvements
There are several next steps that would be interesting to explore:
#### 1. Irregular Vacancies
There are occasionally large empty spaces that show up. I did not work on this further, because of how quickly a new cloud can be generated. However, I would be interesting to work on eliminating this completely.
#### 2. Strict Logarithmic Distribution
Instead of scaling the words to a logarithmic function, words would be distributed evenly along the log curve. This would likely create a more regular and beautiful distribution.
#### 3. Caching
For small input changes, I would be able to reuse previous calculations to make computation time much faster.
#### 4. External Source
It would be interesting to pull words from an external source. Now that the word cloud is generated, it will be easier to pull words from a website, sanitize it, and feed it into the generator.
#### 5. More Mobile Friendly
Currently, this app is responsive and will work on a phone. However, it is not as smooth as it could be.
#### 6. Fonts + Colors
For further development, I would want to allow users to choose fonts (the default one now is the Nutanix font pack) or colors.
