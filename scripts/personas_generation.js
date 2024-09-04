import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const timestamp = new Date().toISOString().replace(/:/g, "-"); // Replace colons to avoid issues in filenames

////////////////////// define constants ///////////////////////////////////////////////
const NUM_OF_PERSONAS = 20;
const OUTPUT_FILE_PATH = `./data/output/student_personas_${NUM_OF_PERSONAS}_${timestamp}.json`;
////////////////////////////////////////////////////////////////////////////////////////

// schema
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

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Extract ${NUM_OF_PERSONAS} student personas. Each persona should include the following details:

        id: starts from 1 and is incremental;
        name: name of the students, make it diverse;
        occupation: be realistic and represent a diverse range of student bodies;
        details: include Age, gender, education level, Relevant details to drive empathy. Insights into their personal or professional journey, and what the persona is trying to achieve with the product or service;
        challenges: Specific learning challenges the persona faces. Be diverse;
        interactions: How the persona might interact with the course;

        """

        Answer each of the above in one single paragraph; no bullet points.
        For each persona, please consider them as a beginner in Computer Science and assume they are taking an introductory programming course.
        Skew the personas to be more typically college-aged (say 17-23).`,
      },
    ],
    response_format: zodResponseFormat(PersonDetails, "peopleDetails"),
    model: "gpt-4o-2024-08-06",
  });

  const personas = completion?.choices?.[0]?.message?.content;

  // Save to file
  fs.writeFileSync(OUTPUT_FILE_PATH, personas);
}

main();
