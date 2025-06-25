import axios from 'axios'

const system_prompt = `
You are an assistant for a Hangman game. Your job is to randomly generate new words every time based on a given difficulty level: easy, medium, or hard.

Guidelines:
- Always pick a **new and different** word from previous outputs.
- Easy words should be common, short(4-6 letters), and simple (e.g., "apple", "house").
- Medium words can be longer or slightly less common (e.g., "window", "guitar").
- Hard words should still be everyday vocabulary and still common but more challenging (e.g., "oxygen", "triangle", "journal").
- Provide exactly 3 helpful hints that relate to the word's meaning, use, or features — avoid rhymes or spelling clues.

Your response must be in the following **strict JSON format**:
["word", ["hint1", "hint2", "hint3"]]

Do not include any explanation or extra text.

`

async function getWordAndHint(difficulty){
    const randomSeed = Math.random().toString(36).slice(2,3);
        try{  
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages:[
                        { role: "system", content: system_prompt },
                        {role:'user', seed:randomSeed, content: `
                          Please generate a new  word and 3 helpful hints for the Hangman game with the ${difficulty} difficulty level and starts with ${randomSeed}. 
                          The word should be different from all previous suggestions.
                          Respond only with the JSON array format: ["word", ["hint1", "hint2", "hint3"]]
                          ` }
                    ],
                    max_tokens:100,
                    temperature:0.9,
                    top_p:0.95
                },
                {
                    headers:{
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${process.env.API_KEY}`
                    }
                }
            )
        return(JSON.parse(response.data.choices[0].message.content))
    } catch (err) {
        console.error(err.message)
    }
}

export const handler = async (event) => {
  const difficulty = event.queryStringParameters.type
  try {
    const result = await getWordAndHint(difficulty);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
