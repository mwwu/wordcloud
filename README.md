

## Word Cloud
![](https://github.com/mwwu/wordcloud/blob/master/imgs/cloud.png)

Live Demo: https://cloudbymegan.herokuapp.com/

### Introduction
For the most part, word clouds are not the most aesthetically pleasing things. In addition to creating a word cloud that fit the specs, I wanted to tackle some aesthetic issues such as minimizing space between words and creating a modern look (minimal and linear; no obliques or retro fonts). In addition, I wanted to utilize React's build in client-side renderingto generate clouds in real time. 

### First Attempt: Bin Packing Problem
For my initial attempt, I noticed the words could be represented as rectangles with different dimensions. If I were able to minimize the white space between words, I would be creating a word cloud with the smallest area. Thus, the problem I had to solve was how to optimally fit rectangles into the minimal boundary area.

I struggled with this optimization problem, until upon further research, I realized that this was a well studied problem called the "Bin Packing Problem". It turns out this is NP-hard, which meant that I was definitely not going to find a computationally usable solution for this project. 

### Second Attempt: Not-so-hard Bin Packing Problem
The problem I now faced was: what kind of simplifications can I introduce to the problem to remove this from the NP-hard class? If I were able to relax some rules, perhaps I could still generate aesthetically pleasing clouds. These are just some rules I tried: (1) Sort the words and divide into ten distinct font sizes; (2) Allow the font size to change within a range; (3) Add words randomly until it fit. 

With these modifications, I was still stuck with Bin Packing problem (1, 2) or I would have such high computation times that the cloud could not be generated in real time (3). In addition, I would still have the challenge of how to represent a patchwork of rectangles. The time and space complexity of checking if a rectangle overlaps any other rectangle is very high.

### Third Attempt: My Solution
I realized I could even further simplify. There were only had two problems to solve. If I had an empty rectangle, I had to fill it up with words. If I had already filled up a rectangular space, I had to expand it by placing another word next to it. This pattern clearly lent itself to a recursive solution. Thus, I created two mutually recursive functions that would call each other until we ran out of space or words.

Here is the algorithm I used:

1. Start with an empty canvas
![](https://github.com/mwwu/wordcloud/blob/master/imgs/1.jpg)

2. Place a word in the center
![](https://github.com/mwwu/wordcloud/blob/master/imgs/2.jpg)

3. Place a second word next to this word
![](https://github.com/mwwu/wordcloud/blob/master/imgs/3.jpg)

4. Fill up any leftover space with words (recursively)
![](https://github.com/mwwu/wordcloud/blob/master/imgs/4.jpg)

5. Place another word next to this filled rectangle (recursively)
![](https://github.com/mwwu/wordcloud/blob/master/imgs/5_1.jpg)
![](https://github.com/mwwu/wordcloud/blob/master/imgs/5_2.jpg)

6. Fill up any leftover space (recursively)
![](https://github.com/mwwu/wordcloud/blob/master/imgs/6.jpg)

7. Repeat



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
#### 6. Text parsing
The text parsing is still very basic. It just blindly removes everything that is not a digit or letter. This will cause problems for contractions, words with apostraphes or hyphens. For production, this would be an important feature to work on.
