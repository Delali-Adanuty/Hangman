import axios from 'axios'

const system_prompt = `
You are an assistant that generates random words for a hangman game for different difficulties: easy, medium, and hard.
With the hard difficulty the words should still be everyday words that we use
For each request, choose a **different** word and generate 3 meaningful hints to help the player guess it.
The keyword here is different
Don't generate previously generated words.
Please respond ONLY with a JSON array in the format: ["word", ["hint1", "hint2", "hint3"]]
Do not add any other text to the response to the array. Strictly!
`


export async function getWordAndHint(difficulty){
    const randomSeed = Math.random().toString(36).slice(2, 8);
        try{
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages:[
                        { role: "system", content: system_prompt },
                        {role:'user', seed:randomSeed, content: `Please generate a new random word and 3 hints that describe the word with ${difficulty} difficulty. Make sure its different from previous suggestions` }
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
  const difficulty = event.queryStringParameters?.difficulty || 'easy';

  try {
    const result = await getWordAndHint(difficulty);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
