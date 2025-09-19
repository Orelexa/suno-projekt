// netlify/functions/generate.js

export async function handler(event, context) {
  console.log(">>> generate.js function called"); // Megjelenik a Netlify logban

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Netlify Function!"
    })
  };
}
