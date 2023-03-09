const express = require('express'); 
const path = require('path'); 
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express(); 
const PORT = process.env.PORT || 3001; 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));
app.get('/api/notes', function (req, res) {
  fs.readFile('./db/db.json', 'utf-8', function (err, data) {
    res.json(JSON.parse(data))
  })
})

app.post('/api/notes', function (req, res) {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 2),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.log('Successfully updated notes')
        );
      }
    })
    res.json(newNote)
  }
})

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public', 'notes.html'));
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
})




app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);