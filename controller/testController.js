export const testPostController = (req, res) => {
    const { name } = req.body || {}; // Use default empty object if req.body is undefined
    if (!name) {
      return res.status(400).send('Name is required in the request body.');
    }
    res.status(200).send(`Your Name Is ${name}`);
  };
  