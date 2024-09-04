import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const timestamp = new Date().toISOString().replace(/:/g, "-"); // Replace colons to avoid issues in filenames

////////////////////// define constants ///////////////////////////////////////////////
const NUM_OF_CHATS = 20;
const OUTPUT_FILE_PATH = `./data/output/simulated_chats_${NUM_OF_CHATS}_${timestamp}.json`;
const MODE = "example"; // "example" mode will use the example COURSE_CONTEXT. "all" mode will go through the folder structure in the input folder.

const AI_TUTOR_PROMPT = `
You are a helpful assistant serving as a teaching assistant in an intro programming course (in python).
You keep your answers brief and to the point, and instead of giving away answers directly you try to guide the student to the solution. Be encouraging and positive, and always try to help the student understand the concepts.
The chat history provided to you will both include messages (as if you're texting with the student), as well as "actions" (denoted with the prefix "ACTION:") which represent how the student interacts with our tutoring platform and/or how you generate structured responses to specific student queries which are then used to populate UI the student can interact with.
If it's not denoted (specifically as an "ACTION:"), assume that a given message is from messaging with the student.
You should always respond as if you are messaging with the student (and thus should never include "ACTION:" in your responses).
Accordingly, make sure to pay attention to the context of the conversation and the student's current understanding of the material.
Lastly, as I said before, keep it brief/concise as to avoid overwhelmingly the student.
`;

const COURSE_CONTEXT = `
# Summary of CIS 3260 - Introduction to Programming Individual Assignment 1

## Purpose:
The assignment aims to introduce fundamental programming concepts using Python, focusing on writing simple programs, debugging, and understanding types of programming errors. Students are tasked with implementing code that includes user interaction, mathematical computations, and error analysis.

## Main Topics Covered:

1. **Basic Output**:
   - Write a program to display specific string messages.
   - Focuses on understanding simple output functions and program structure.

2. **Mathematical Expressions**:
   - Create a program to compute and display the result of an algebraic expression.
   - Teaches the use of mathematical operators and the importance of syntax in Python programming.

3. **User Input and Variable Manipulation**:
   - Develop a program to calculate average velocity using user-provided data (start distance, end distance, and time).
   - Introduces concepts such as input functions, variable assignment, and basic arithmetic operations.

4. **Error Identification and Resolution**:
   - Each programming task requires students to document programming errors encountered, categorize them as syntax, runtime, or logical errors, and explain how they were resolved.
   - Emphasizes the importance of problem-solving in programming and familiarizes students with debugging techniques.

## Critical Details:
- Each program must be properly documented with comments for clarity and should follow a naming convention (IA1Q#.py).
- Along with the source code, students must submit a Word document (IA1.doc) summarizing their programming experience, including errors faced and time spent resolving them.
- Specific learning objectives align with different tasks throughout the assignment, ensuring students absorb critical programming concepts and best practices during their initial programming experience.

This assignment lays the foundation for programming skills, promoting a structured approach to coding, troubleshooting, and effective documentation.
`;

const STUDENT_PERSONA = `
Asha Patel, a 19-year-old Psychology undergraduate from Singapore, is deeply interested in integrating technology with mental health services. She is currently pursuing her Bachelor's degree and taking an introductory programming course to learn how software development can support this field. Asha is passionate about creating a mobile application aimed at helping teenagers manage stress and anxiety, blending her love for psychology with her burgeoning interest in technology. Despite her enthusiasm, she finds the logical aspects of programming challenging and struggles with technical jargon, making it difficult to quickly grasp theoretical concepts. Asha prefers practical assignments and hands-on projects over theoretical readings, actively participates in online discussions, seeks clarification from classmates and professors, and often collaborates in study groups or experiments with coding exercises in the tech lab.
`;
////////////////////////////////////////////////////////////////////////////////////////

// schema
const ChatsDetails = z.object({
  personas: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: ` 

        Student Persona: ${STUDENT_PERSONA};

        Course Context: ${COURSE_CONTEXT};

        AI Tutor Prompt: ${AI_TUTOR_PROMPT};
        
        """
        Based on the above information, help me simulate ${NUM_OF_CHATS} back and forth conversations between AI Tutor and a human student in the Course Context.



        role: either 'assistant' or 'user'. assistant represent AI tutor. user represents human student;
        content: is the simulated conversation.
        `,
      },
    ],
    response_format: zodResponseFormat(ChatsDetails, "chatDetails"),
    model: "gpt-4o-2024-08-06",
  });

  const personas = completion?.choices?.[0]?.message?.content;

  // Save to file
  fs.writeFileSync(OUTPUT_FILE_PATH, personas);
}

main();
