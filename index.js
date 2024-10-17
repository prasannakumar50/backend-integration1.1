const express = require('express')
const app = express();

const {initializeDatabase} = require("./db/db.connect");
const Movie = require("./models/movie.models");

app.use(express.json())

initializeDatabase();


  async function createMovie(newMovie){
    try{
       const movie = new Movie(newMovie)
       const savedMovie = await movie.save();
       return savedMovie
    }catch(error){
       throw error
    }
  }
  //createMovie(newMovie);

  app.post("/movies", async(req, res)=>{
   try{
      const saveMovie = await createMovie(req.body)
      res.status(201).json({message : 'New Movie added successfully'})
   }catch(error){
      res.status(500).json({error: 'Failed to add movie'})
   }
  })



  //find a movie with particular title
  async function readMovieByTitle(movieTitle){
   try{
    const movie = await Movie.findOne({title: movieTitle})
    return movie
   //  console.log(movie)
   }catch(error){
        throw error;
   }

  }
  //readMovieByTitle("Bahubali: The Beginning")

  app.get("/movies/:title", async(req, res)=>{
   try{
      const movie = await readMovieByTitle(req.params.title)
      if(movie){
          res.json(movie)
      }else{
          res.status(404).json({error: 'Movie Not Found'})
      }

   }catch(error){
      res.status(500).json({error: 'failed to fetch movie'})
   }
  })


  //to get all the movies in the database
  async function readAllMovies(){
   try{
      const allMovies = await Movie.find()
      return allMovies
      //console.log(allMovies)
   }catch(error){
      console.log(error)
   }
  }
  //readAllMovies();

  app.get("/movies", async (req, res)=>{
    try{
      const movies = await readAllMovies()
      if(movies.length!=0){
         res.json(movies)
      }else{
         res.status(404).json({error: 'Movies not Found'})
      }
    }catch(error){
         res.status(500).json({error: 'failed to fetch movies'})
    }

  })



  //get movie by directorName

  async function readMovieByDirector(directorName){
   try{
      const movieByDirector = await Movie.find({director: directorName})
      return movieByDirector
   }catch(error){
      console.log(error)
   }
  }

  
  app.get("/movies/director/:directorName", async(req, res)=>{
   try{
    const movies = await readMovieByDirector(req.params.directorName)
    if(movies.length!=0){
        res.json(movies)
    }else{
        res.status(404).json({error: 'No Movies Found'})
    }
   }
   catch(error){
      res.status(500).json({error: 'failed to fetch movies'})
   }
  })

  //readMovieByDirector("Rajkumar Hirani");

  async function readMovieByGenre(genreName){
   try{
      const movieByGenre = await Movie.find({genre: genreName})
      return movieByGenre
   }catch(error){
      console.log(error)
   }
  }

  app.get("/movies/genre/:genreName", async(req, res)=>{
   try{
      const movies = await readMovieByGenre(req.params.genreName)
      if(movies.length!=0){
         res.json(movies)
      }else{
         res.status(404).json({error: 'Movies not found'})
      }
   }catch(error){
      res.status(500).json({error: 'failed to fetch movies'})
   }
  })



  async function deleteMovie(movieId){
   try{
      const deletedMovie = await Movie.findByIdAndDelete(movieId)
      return deletedMovie
   }catch(error){
      console.log(error)
   }
  }

  app.delete("/movies/:movieId", async(req, res)=>{
   try{
     const deletedMovie = await deleteMovie(req.params.movieId)
     res.status(200).json({message: 'Movie deleted successfully'})
   }catch(error){
     res.status(500).json({error: 'Failed to delete movie'})
   }
  })


  async function updateMovie(movieId, dataToUpdate){
   try{
      const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {new: true})
      return updatedMovie
   }catch(error){
      console.log('Error in updating movie')
   }
  }

  app.post("/movies/:movieId", async(req, res)=>{
   try{
     const updatedMovie = await updateMovie(req.params.movieId, req.body)
     if(updatedMovie){
      res.status(200).json({message: 'Movie updated successfully', updatedMovie : updatedMovie})
     }else{
      res.status(404).json({message: 'Movie not found'})
     }
   }catch(error){
      res.status(500).json({error: 'Failed to update movie'})
   }
  })

  const PORT = 3000;

  app.listen(PORT, ()=>{
   console.log(`server running on ${PORT}`)
  })