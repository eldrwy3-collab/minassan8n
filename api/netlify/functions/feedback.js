exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  try {
    const { email, type, message } = JSON.parse(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Thank you. Your message was received." })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
