# **how i structure introductions to research papers**
_Dan Fu, Jan 7 2025_

This is a part of a series I’m writing to distill what I learned about writing research papers during my PhD into a series of blog posts. Previously, I put up the [coffee experiment](../coffee.html) protocol. In this post, I’ll talk about how I like to use Jennifer Widom’s [five-bullet structure](https://cs.stanford.edu/people/widom/paper-writing.html#intro) for drafting introductions.

_As with everything in this series, this advice comes from a long line of PhD students before me – in this case from the [Stanford InfoLab](http://infolab.stanford.edu/), to [HazyResearch](https://hazyresearch.stanford.edu/), down to me. The many generations of students before me (and their advisors) should get all the credit!_

In this blog, I’ll talk through Jennifer Widom’s five-point introduction bullets, talk through my interpretation of them, and go through a concrete example from one of my papers (FlashAttention).

## **the bullets**
I like to use Jennifer Widom’s [five-bullet structure](https://cs.stanford.edu/people/widom/paper-writing.html#intro) for writing introductions. These are taken verbatim from her great essay on [Tips for Writing Technical Papers](https://cs.stanford.edu/people/widom/paper-writing.html#intro):
* **What is the problem?**
* **Why is it interesting and important?**
* **Why is it hard?** (E.g., why do naive approaches fail?)
* **Why hasn’t it been solved before?** (Or, what's wrong with previous proposed solutions? How does mine differ?)
* **Why are the key components of my approach and results?** Also include any specific limitations.

_As an exercise, take a well-written paper that you like, and backfill in the answers to the bullets._

Below, I’ll talk through my interpretation of these bullets and how I use them.

## **how i use the bullets**
Let’s go through each bullet one at a time, using the [FlashAttention paper](https://arxiv.org/abs/2205.14135) as an example.

#### **what is the problem?**
**This bullet is important to get right for a research paper. The key is to _scope the problem correctly_.**
* You don’t want a problem statement that’s too broad (“The goal of this paper is to create AGI”) or too narrow (“The goal of this paper is to get XX score on task YY in benchmark ZZ.”)

For example, in the FlashAttention paper, this line defines our problem: “An important question is whether making attention faster and more memory-efficient can help Transformer models address their runtime and memory challenges for long sequences.”
* We intentionally scope to long sequences, since we want to highlight the memory efficiency of the method.
* We also put a specific emphasis on measured speed and runtime efficiency (as opposed to, e.g. FLOP counting).

_**Common pitfall:** A common pitfall in this bullet is to get the **level of abstraction** wrong. If you show a draft of your introduction to someone and they start asking “what about X, Y, Z baseline” that is not relevant – then perhaps you have defined your problem too broadly._

#### **why is it interesting and important?**
**The key to this bullet is that _interesting_ and _important_ are two separate, orthogonal concepts.**
* Important has to do with the impact of the research: will this enable some new capability, does it address some question that is important to the community, etc. These days, I find that this question is easier to answer for most students.
* Interesting answers a different question entirely: What intellectual itch does this scratch? What are the questions “of independent interest” that it touches on? Why is it interesting **to you?**
* In my opinion, research should always be interesting, but it doesn't always have to be immediately important. Ideally it is interesting **and** important – but sometimes we write papers purely out of interest.

**In FlashAttention:**
* Important: “Transformer models have emerged as the most widely used architecture in applications such as natural language processing and image classification” – if this work is successful, it will impact all these applications.
* Interesting: “Many approximate attention methods have aimed to reduce the compute and memory requirements of attention” – it is independently interesting that people have been trying to address the quadratic bottleneck, and we are taking a different approach.

_**Common pitfall:** Don’t get “important” confused for “interesting.” They are separate concepts, and you pitch them differently!_

#### **why is it hard?**
**This bullet is about laying out the technical challenges that you had to overcome.**
* Ideally, it should parallel your technical contributions – e.g., there are challenges A, B, C, which we will address with techniques X, Y, Z.
* Sometimes you have a temptation to omit this part – “my method is the best and it just works!” But laying out the technical challenges is the real meat and intellectual merit of your contribution.
* You should think of each claim in this section as needing either a citation or a micro-experiment in the body. Show-not-tell!

**In FlashAttention:**
* “On modern GPUs, compute speed has out-paced memory speed, and most operations in Transformers are bottlenecked by memory accesses.”
* “Common Python interfaces to deep learning such as Pytorch and Tensorflow do not allow fine-grained control of memory access.”

_**Common pitfall:** Don’t omit the technical challenges. You may feel tempted to make the paper seem like it “just worked” – but then you’re missing the key things you learned from the process!_

#### **why hasn’t it been solved before?**
**This bullet is about laying out the baselines. It should help you clarify the major contributions.**
* This bullet is **not** about writing defensively – “Work A does X, whereas we do Y. Work B does W, whereas we do Z.” The goal is to lay out the lessons you learned and explain what insights previous work was missing.

**In FlashAttention:**
* “Although [approximate attention methods] reduce the compute requirements, many of them do not display wall-clock speedup. One main reason is that they focus on FLOP reduction and tend to ignore overheads from memory access.”
* “In this paper, we argue that a missing principle is making attention algorithms IO-aware.”

_**Common pitfall:** If you don’t have any answer to this question (there are no baselines), consider that your problem statement may be at the wrong level of abstraction. It is very rare that you are doing something completely new that has no prior work (though it does happen)._

#### **what are the key components of my approach and results?**
**This bullet has two parts: the _key components_ and the _results_. You need both.**
* Ideally, the key components are tee’d up by the challenges in your “Why is it hard” bullet. “For challenge A, we do X. For challenge B, we do Y.”
* For the results, give a brief highlight of the key evaluations, **with numbers**. “On benchmark X, we outperform baseline Y by Z points.”

It’s important to bring the evaluations to your reader, and explain the benefits in the language they understand. If you’re writing a systems paper in an ML conference, close the loop and explain why it’s important for an ML audience.
* Sometimes, you’re in a new setting where the evaluations aren’t obvious. Then it’s extra important to carefully define the problem and set up the evaluation settings.
* Not everything has to be novel in this bit – sometimes you are applying classical techniques in a new way (FlashAttention does this). Just be precise about what is new, and what is old.

**In FlashAttention:**
* Key components:
  * “We propose Flashattention, a new attention algorithm that computes exact attention with far fewer memory accesses.”
  * “We apply two well-established techniques to address these challenges… **tiling** and **recomputation**.”
  * “We implement FlashAttention in CUDA to achieve fine-grained control over memory access and fuse all the attention operations into one GPU kernel.”
* Results:
  * “We train BERT-large 15% faster than the training speed record in…”
  * “We observe a 0.7 improvement in perplexity on GPT-2… FlashAttention enables the first Transformer that can achieve better-than-chance performance on the Path-X challenge.”
  * “FlashAttention is up to 3x faster than the standard attention implementation across common sequence lengths from 128 to 2K and scales up to 64K.”

_**Common pitfall:** Not explaining your method in enough detail, or not including concrete numbers for results. Someone should be able to get the overall story and major results of your paper just from reading the introduction._

## **conclusion**
I use these five bullets frequently during my research process, starting weeks or months before it’s time to write the paper. For me, the bullets help clarify my thought and the major technical insights. If I'm missing an answer to one of the questions - I know my work is incomplete, and I have a guide to doing better.

I hope this helps!
