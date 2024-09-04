# media-pytutor-synthetic-data-poc

Synthetica Data, Persona Generation PoC.

## Personas Generations

We use OpenAI's [Structured Output](https://platform.openai.com/docs/guides/structured-outputs/structured-outputs). Advantage of Structured Output is the schema adherance.

```js
const PersonDetails = z.object({
  personas: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      occupation: z.string(),
      details: z.string(),
      challenges: z.string(),
      interactions: z.string(),
    })
  ),
});
```

The output will be stored in the data/output folder with the `student_personas_NUM_TIMESTAMP.json` naming convention.

This is what a sample output looks like

<details>
<summary>a sample output file</summary>

```json
{
  "personas": [
    {
      "id": "1",
      "name": "Asha Patel",
      "occupation": "Psychology Undergraduate Student",
      "details": "Asha Patel is a 19-year-old female from Singapore, currently pursuing a Bachelor's degree in Psychology at a local university. She has a keen interest in how technology can be used to improve mental health services and is taking an introductory programming course to understand how software might be designed to support this field. Asha loves working on projects that combine her love for psychology with her growing interest in technology. She aims to develop her own mobile application that can help teenagers manage stress and anxiety.",
      "challenges": "Despite her enthusiasm, Asha often struggles with the logical constructs of programming, finding it challenging to translate her ideas into code. She is also unfamiliar with technical jargon which makes theoretical concepts harder to grasp quickly.",
      "interactions": "Asha prefers engaging with the course through practical assignments and hands-on projects rather than theoretical readings. She actively participates in online discussions and seeks help from her classmates and professors to clarify her doubts. She often joins study groups to collaborate on assignments and borrows time at the tech lab to experiment with coding exercises."
    },
    {
      "id": "2",
      "name": "Miguel Torres",
      "occupation": "Business Management Student",
      "details": "Miguel Torres is a 21-year-old male from Mexico, currently studying Business Management at a well-known international university. Though his primary focus is on business, he knows that understanding technology is crucial in today's market and has decided to explore programming to enhance his skill set. He is energetic, curious, and often thinks of ways to integrate technology into business strategies, especially in streamlining operations for small businesses.",
      "challenges": "Miguel finds it difficult to abstract when learning new programming concepts and often needs concrete examples to see how they apply to real-world scenarios. Time management is also an issue for him as he juggles multiple commitments including sports and club activities.",
      "interactions": "Miguel is a visual learner and benefits from video tutorials and interactive coding platforms which provide immediate feedback. He usually connects with his course instructors during office hours for one-on-one guidance and is active in discussion forums where he both asks questions and helps peers with business-related applications of programming."
    }
  ]
}
```

</details>

## Chats Simulation

<details>
<summary>a sample output file</summary>

```json
{
  "personas": [
    {
      "role": "user",
      "content": "Hi, I'm having trouble with understanding the concept of \"loops\" in the Python course. Can you help me?"
    },
    {
      "role": "assistant",
      "content": "Of course! Loops are used to repeat a block of code multiple times. A common type is the \"for loop\", which iterates over a sequence like a list or string. Have you tried writing a simple loop yet?"
    },
    {
      "role": "user",
      "content": "I haven't written one yet, but I keep getting confused about when to use a \"for loop\" and when to use a \"while loop\"."
    },
    {
      "role": "assistant",
      "content": "Great question! Use a \"for loop\" when you know before starting the loop how many times you'll need to execute it. Use a \"while loop\" when the number of iterations needs to be determined by a condition."
    },
    {
      "role": "user",
      "content": "Oh, that makes sense. Can you give me an example of each?"
    },
    {
      "role": "assistant",
      "content": "Sure! A \"for loop\" example is: `for i in range(3): print(i)` which prints numbers 0, 1, 2. A \"while loop\" example is: `i = 0 while i < 3: print(i) i += 1`, which does the same thing."
    },
    {
      "role": "user",
      "content": "Thanks! That helps. I'll give these a try and let you know if I run into any issues."
    },
    {
      "role": "assistant",
      "content": "Sounds good, let me know how it goes! Remember, practice is key!"
    },
    {
      "role": "user",
      "content": "Hi again, I'm trying to debug my code, but I keep getting a \"syntax error\". I'm not sure what's causing it."
    },
    {
      "role": "assistant",
      "content": "Syntax errors often occur due to typos or incorrect use of Python keywords. Could you check if all your colons, indentations, and parentheses are correctly placed?"
    },
    {
      "role": "user",
      "content": "I found a missing colon in my \"if\" statement! But now it says \"IndentationError\"."
    },
    {
      "role": "assistant",
      "content": "Python relies on indentation to define code blocks. Make sure each block of code, like after \"if\", is indented consistently. Try using either spaces or tabs, but not both."
    },
    {
      "role": "user",
      "content": "Got it! I fixed the indentation, and it runs now. Thank you!"
    },
    {
      "role": "assistant",
      "content": "Great job! Debugging can be tricky, but you're getting the hang of it. Keep practicing!"
    },
    {
      "role": "user",
      "content": "I'm struggling with how to document my code properly. Any tips?"
    },
    {
      "role": "assistant",
      "content": "Certainly! Use comments to explain your code's purpose. Start each file with a brief description, and use comments to clarify complex sections. Always make your code as readable as possible for others."
    },
    {
      "role": "user",
      "content": "Do you recommend using comments for every line of code?"
    },
    {
      "role": "assistant",
      "content": "Not for every line. Focus on areas that aren't immediately clear or when explaining the logic behind your code. Comments should enhance understanding, not clutter your code."
    },
    {
      "role": "user",
      "content": "That makes sense, I'll try to add meaningful comments to my assignment. Thanks!"
    },
    {
      "role": "assistant",
      "content": "You're welcome! Detailed comments will definitely help others (and future you) understand your code better. Let me know if you have more questions!"
    },
    {
      "role": "user",
      "content": "One last question, what's the best way to handle user inputs for the velocity calculation program?"
    },
    {
      "role": "assistant",
      "content": "Good question! Use the `input()` function to get data from the user. Then, you can convert it to the needed type with functions like `int()` or `float()` before performing calculations. Do some tests to ensure you're handling invalid inputs properly."
    }
  ]
}
```

</details>
