<h2> FAQ Chatbot using NLP </h2> <br>
I put this project together to solve a common problem: making a chatbot that actually understands what a person is asking without needing a massive, complex AI model. This was built as part of my Task 2 (referencing image_b21262.png) using Antigravity IDE.

How it works
The core of this bot is about Retrieval. Instead of the bot "hallucinating" or guessing an answer, it looks at a specific set of FAQs I provided in a data.json file.

I didn't want the bot to fail just because someone used different wording, so I used TF-IDF and Cosine Similarity. Basically, the code turns the user's question into math (a vector) and compares it to my stored questions. Even if the wording isn't a 100% match, the bot finds the "closest" possible answer. If the question is completely irrelevant, I set a threshold so it just tells the user it doesn't know the answer yet.

What’s under the hood?
Python: The main logic.

Scikit-Learn: Handles the heavy lifting for the TF-IDF math and similarity scores.

JSON: I used this for the data because it's super easy to add or change questions without touching the actual code.

NLTK: For cleaning up the text so the bot focuses on the words that actually matter.

Setting it up
If you're trying to run this on your own machine:

Make sure you've got Python set up in your system path (I had to fix this on my PC to get it running!).

Install the libraries: pip install scikit-learn nltk

Just run python main.py and start chatting. You can type quit whenever you're done.

Feedbacks are welcome!
