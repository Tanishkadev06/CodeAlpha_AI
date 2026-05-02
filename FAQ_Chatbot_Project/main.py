import json
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Load Data
with open('data.json', 'r') as f:
    data = json.load(f)

questions = [item['question'] for item in data['faqs']]
answers = [item['answer'] for item in data['faqs']]

# 2. Preprocessing & Vectorization
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(questions)

def get_response(user_input):
    # Transform user input to the same vector space
    user_tfidf = vectorizer.transform([user_input])
    
    # Calculate similarity between input and all FAQ questions
    similarities = cosine_similarity(user_tfidf, tfidf_matrix)
    
    # Find the index of the highest similarity score
    index = similarities.argmax()
    score = similarities[0][index]

    # Threshold: If similarity is too low, we don't know the answer
    if score < 0.3:
        return "I'm sorry, I don't understand that question."
    
    return answers[index]

# 3. Simple Chat Loop
print("Chatbot: Hello! Ask me anything (type 'quit' to exit).")
while True:
    user_query = input("You: ")
    if user_query.lower() == 'quit':
        break
    print(f"Chatbot: {get_response(user_query)}")