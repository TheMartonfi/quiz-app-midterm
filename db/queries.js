//Returns an array of quizzes
const getAllPublicQuizzes = function(db){
  return db.query(`
  SELECT title, category, description, COUNT(results.*) as times_played, AVG(quiz_rating) as average_rating
  FROM quizzes
  JOIN results ON quizzes.id = results.quiz_id
  WHERE NOT is_unlisted
  GROUP BY title, category, description;`)
  .then(res => res.rows);
}
exports.getAllPublicQuizzes = getAllPublicQuizzes;

//Returns a quiz object
const getQuiz = function(db, options){
  return db.query(`
  SELECT title, category, description, COUNT(results.*) as times_played, AVG(quiz_rating) as average_rating
  FROM quizzes
  JOIN results ON quizzes.id = results.quiz_id
  WHERE quizzes.id = ${options.id}
  GROUP BY title, category, description;`)
  .then(res => res.rows[0]);
}
exports.getQuiz = getQuiz;

//Returns an array of results
const getQuizResults = function(db, options){
  let queryString = `
  SELECT result, users.username, time_spent, quiz_rating, title, category, description
  FROM results
  JOIN quizzes ON quiz_id = quizzes.id
  JOIN users ON user_id = users.id`;
  const queryOptions = [];

  if(options.quiz_id){
    queryString += `
    AND quiz_id = $1`;
    queryOptions.push(options.quiz_id);
  } else {
    if(options.title){
      queryOptions.push(`%${options.title}%`);
      queryString += `
      AND quizzes.title LIKE $${queryOptions.length}`;
    }
    if(options.category){
      queryOptions.push(`${options.category}`);
      queryString += `
      AND category = $${queryOptions.length}`;
    }
  }

  return db.query(queryString, queryOptions)
  .then(res => res.rows);
}
exports.getQuizResults = getQuizResults;

//Inserts and returns one new quiz object
const insertNewQuiz = function(db, options){
  return db.query(`
  INSERT INTO quizzes (owner_id, title, category, description, is_unlisted)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`,
  [options.owner_id, options.title, options.category, options.description, options.is_unlisted])
  .then(res => res.rows[0]);
}
exports.insertNewQuiz = insertNewQuiz;

//Inserts and returns one new question object
const insertNewQuestion = function(db, options){
  return db.query(`
  INSERT INTO questions_and_answers (quiz_id, question, answer_1, answer_2, answer_3, answer_correct)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *`,
  [options.quiz_id, options.question, options.answer_1, options.answer_2, options.answer_3, options.answer_correct])
  .then(res => res.rows[0]);
}
exports.insertNewQuestion = insertNewQuestion;

//Inserts and returns one new question object
const insertNewResult = function(db, options){
  return db.query(`
  INSERT INTO results (quiz_id, user_id, result, time_spent, quiz_rating)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`,
  [options.quiz_id, options.user_id, options.result, options.time_spent, options.quiz_rating,])
  .then(res => res.rows[0]);
}
exports.insertNewResult = insertNewResult;