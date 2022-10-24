const express = require('express');
const path = require('path');
const { readFile } = require('fs');
const fs = require('fs');
const uuid = require('./helpers/uuid');
/*const Route = require('./controller');*/

const PORT = 3880;//process.env.PORT;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/api', api);
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for API
app.get('/api/notes', (req, res) => {
  const json = readFile('./db/db.json', 'utf8', (err, data) => {
    //console.log(json);
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    }
  })
});

app.delete('/api/notes/:id', (req, res) => {
  if (req.body && req.params.id) {
    const id = req.params.id;
    for (let i = 0; i < notes.length; i++) {
      const currentNote = notes[i];
      if (currentNote.id === id) {

        res.status(200).json(``);
        return;
      }
    }
    res.status(404).json('Review ID not found');
  }
});// query param with note ID to delete. Read all notes, delete and then rewrite

// POST Route for API
// Receive new note with request body and add to db.json
// and return new note to client. Use unique ID with NPM package

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  
  // If title and text are present
  if (title && text) {
  
    const newNote = {
      title,
      text
    };

    const json = readFile('./db/db.json', 'utf8', (err, data) => {
      //console.log(json);
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        // Add new note to array
        parsedNotes.push(newNote);

        // Save updated notes back to the file
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
        );
      }
    })
    const response = {
      status: 'Successful!',
      body: newNote,
    };
    console.log(newNote);
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
}); 
    /*const response = {
      status: 'success',
      body: 'test',
    };

    console.log(response);
    res.status(201).json(response);*/

  //} else {
    //res.status(500).json('Error in posting review');
  // //}
    //const jsonObj = JSON.stringify(json);
  // console.log(readFile);
  //res.json(`${req.method} request received to get reviews`);
  // Log our request to the terminal
  //console.info(`${req.method} request received to get reviews`);
   // fs.writeFile(path.join(__dirname, './db/db.json'));
// read db.json and return all saved notes as JSON




// GET Route for index page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
