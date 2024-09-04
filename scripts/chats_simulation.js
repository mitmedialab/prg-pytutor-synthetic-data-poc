import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

////////////////////// define constants ///////////////////////////////////////////////
const NUM_OF_CHATS = 20;
const MODE = "example"; // We are now processing all files. Change it to "example" for an example
const INPUT_DIR = "./data/input"; // Input folder path
const OUTPUT_DIR = "./data/output/chats"; // Output folder path
const AI_TUTOR_PROMPT = `
You are a helpful assistant serving as a teaching assistant in an intro programming course (in python).
You keep your answers brief and to the point, and instead of giving away answers directly you try to guide the student to the solution. Be encouraging and positive, and always try to help the student understand the concepts.
The chat history provided to you will both include messages (as if you're texting with the student), as well as "actions" (denoted with the prefix "ACTION:") which represent how the student interacts with our tutoring platform and/or how you generate structured responses to specific student queries which are then used to populate UI the student can interact with.
If it's not denoted (specifically as an "ACTION:"), assume that a given message is from messaging with the student.
You should always respond as if you are messaging with the student (and thus should never include "ACTION:" in your responses).
Accordingly, make sure to pay attention to the context of the conversation and the student's current understanding of the material.
Lastly, as I said before, keep it brief/concise as to avoid overwhelmingly the student.
`;

const STUDENT_PERSONA = `
Asha Patel, a 19-year-old Psychology undergraduate from Singapore, is deeply interested in integrating technology with mental health services. She is currently pursuing her Bachelor's degree and taking an introductory programming course to learn how software development can support this field. Asha is passionate about creating a mobile application aimed at helping teenagers manage stress and anxiety, blending her love for psychology with her burgeoning interest in technology. Despite her enthusiasm, she finds the logical aspects of programming challenging and struggles with technical jargon, making it difficult to quickly grasp theoretical concepts. Asha prefers practical assignments and hands-on projects over theoretical readings, actively participates in online discussions, seeks clarification from classmates and professors, and often collaborates in study groups or experiments with coding exercises in the tech lab.
`;

// schema
const ChatsDetails = z.object({
  personas: z.array(
    z.object({
      role: z.string(),
      content: z.string(),
    })
  ),
});

// Recursively get all files in a directory
const getFilesInDirectory = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);

    // Skip over unwanted files like .DS_Store and hidden files
    if (file.startsWith(".")) return;

    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Recursively fetch files from subdirectories
      results = results.concat(getFilesInDirectory(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
};

// Function to process a file and generate simulated chat
const processFile = async (filePath) => {
  const courseContext = fs.readFileSync(filePath, "utf-8");
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `

        Student Persona: ${STUDENT_PERSONA};

        Course Context: ${courseContext};

        AI Tutor Prompt: ${AI_TUTOR_PROMPT};

        """
        Based on the above information, help me simulate ${NUM_OF_CHATS} back and forth conversations between AI Tutor and a human student in the Course Context.

        role: either 'assistant' or 'user'. assistant represents AI tutor, user represents human student;
        content: is the simulated conversation.

        Please note that conversations do not necessarily need to reach a conclusion; you can represent a variety of content styles and student emotions, including happiness, anger, and distress.
        `,
      },
    ],
    response_format: zodResponseFormat(ChatsDetails, "chatDetails"),
    model: "gpt-4o-2024-08-06",
  });

  const personas = completion?.choices?.[0]?.message?.content;
  return personas;
};

// Function to generate output file path with the same structure in the output folder
const generateOutputFilePath = (inputFilePath) => {
  const relativePath = path.relative(INPUT_DIR, inputFilePath);
  const baseName = path.basename(inputFilePath, path.extname(inputFilePath)); // Get the base name without the extension
  const outputFilePath = path.join(
    OUTPUT_DIR,
    path.dirname(relativePath),
    `simulated_chat_${baseName}.json` // Append .json after removing original extension
  );
  return outputFilePath;
};

// Ensure output directory exists
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function main() {
  if (MODE === "all") {
    // Get all files in the input directory
    const files = getFilesInDirectory(INPUT_DIR);

    for (const file of files) {
      try {
        // Process each file and generate a simulated chat
        const simulatedChat = await processFile(file);

        // Generate output file path and ensure the directory exists
        const outputFilePath = generateOutputFilePath(file);
        ensureDirectoryExists(outputFilePath);

        // Write the simulated chat to the output file
        fs.writeFileSync(outputFilePath, simulatedChat);
        console.log(`Successfully processed and saved: ${outputFilePath}`);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  } else if (MODE === "example") {
    const simulatedChat = await processFile(
      "data/input/course_description.txt"
    );
    fs.writeFileSync("data/output/simulated_chat_example.json", simulatedChat);
  }
}

main();
