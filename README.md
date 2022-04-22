

## Word Cloud
![](https://github.com/mwwu/wordcloud/blob/master/imgs/cloud.png)

Live Demo: https://cloudbymegan.herokuapp.com/

### Abstract
Word clouds present a unique challenge for both design and engineering. How does one minimize space between words? How does one create a modern look (minimal and linear; no obliques or retro fonts)? Most importantly, how does one dynamically generate clouds in real-time? 
 


Ultimately I solved the word cloud challenge by relating it to the NP-Hard bin-packing problem. I then reduced the bin-packing problem to yield a solution that could dynamically generate word clouds. In this repository, I prioritized coming up with an elegant recursive solution in javascript, making this an exercise in functional programming. At the same time, I emphasized aesthetic principles, making this an exercise in creativity. Overall, this solution took me around 30 hours, spread out over 2 weekends and involves several hundred lines of code that I wrote from scratch.

### Specifications and Requirements
- A tag cloud (or word cloud) is a unique way to visually display a body of text by making certain
words within the text bigger usually to represent frequency or significance of the word.
- No outside frameworks or libraries could be used except React JS
- Live generation was not required. Rather, the easier solution would be to type a list of words, click a button, and wait for the word cloud to load all at once. However I wanted to make this word cloud better and easier to use for the viewer. Since React already does live client rendering, why not just make the word cloud generate as one types? 

### Style
For the style, I referred to the Nutanix Style Guide that I found online. This is the reason why the word cloud was built to be modern and light, just like the principles in the Style Guide.

### Word Clouds are a Bin Packing Problem
For my initial attempt, I noticed the words could be represented as rectangles with different dimensions. If I were able to minimize the white space between words, I would be creating a word cloud with the smallest area. Thus, the problem I had to solve was how to optimally fit rectangles into a minimal boundary area.

In order to do this, I would have to, first, maintain some sort of representation of the already covered areas. This way, I could test whether a new word would overlap in any position. Then, for every word I placed, the next word could be placed any pixel within a reasonable distance from the first one. I would then be required to iterate through every permutation of placement for all n words. This would require a huge amount of computation.

I struggled with this optimization problem, until I realized that this was an NP-hard problem. It is similar to a problem called the "Bin Packing Problem". It would be difficult to find a computationally usable solution in time for this project. 

### Reducing the Bin Packing Problem
The problem I now faced was: what kind of simplifications can I introduce to the problem to remove this from the NP-hard class? If I were able to relax some rules, perhaps I could still generate aesthetically pleasing clouds. These are just some rules I tried: (1) Sort the words and divide into ten distinct font sizes; (2) Allow the font size to change within a range; (3) Add words randomly until it fit. 

With these modifications, I was still stuck with Bin Packing problem (1, 2) or I would have such high computation times that the cloud could not be generated in real time (3). In addition, I would still have the challenge of how to represent a patchwork of rectangles. The time and space complexity of checking if a rectangle overlaps any other rectangle is very high.

### An Elegant Recursive Solution
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

A crucial benefit of this recursive solution, is the ease in representing coverage. We no longer need to know the placement of each individual rectangle, and the pixels it covers. Representation is reduced to only three rectangles. The outer-most boundary, the area that has already been optimally filled in, and the rectangular left over space (the dotted rectangle above). Thus, each new rectangle only needs to be checked against, at most, two rectangular areas (a great improvement over checking every single individual word).

Another important feature I added was mapping the word frequencies onto a logarithmic distribution. Initially, words that occurred five times, would be five font sizes larger than a word that occurred once. This made the word cloud very confusing to read, because very frequent words looked more or less the same as less frequent ones. By applying a logarithmic function, the most frequent words would be significantly larger than the rest of the words. This greatly increased the readability of the word cloud.

This solution turns out to be O(n) = n^2. This computation is completed every time the input text changes. For our small amount of words (limited to 9k characters), this was acceptable because the delay from computation was not very noticable. 

### Security and Edge Cases
In terms of security, I believe this web app is safe from malicious text. First, this is just a very simple client-side only application. All user input is processed in the client's browser and nothing is sent back to the server. In addition, React is known to be XSS safe, which means that any strings will be escaped. In addition, our singular user input is immediately stripped of any characters that are not digits or letters, before getting written onto the canvas.
In terms of edge cases, empty inputs are accepted and large inputs are limited to 9k characters.

### Future / Next Steps
There are several next steps that would be interesting to explore:
#### 1. Irregular Vacancies
There are occasionally large empty spaces that show up. I did not work on this further, because of how quickly and efficiently a new cloud can be generated. It would be interesting to work on eliminating this completely.
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
