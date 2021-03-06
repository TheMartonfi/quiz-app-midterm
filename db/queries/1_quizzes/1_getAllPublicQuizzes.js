//Returns an array of quizzes
const getAllPublicQuizzes = function(db){
  return db.query(`
  SELECT quizzes.id, title, category, description, time_limit, COUNT(results.*) as times_played, AVG(quiz_rating) as average_rating, quizzes.image
  FROM quizzes
  FULL OUTER JOIN results ON quizzes.id = results.quiz_id
  WHERE NOT is_unlisted = true
  GROUP BY quizzes.id, title, category, description
  ORDER BY average_rating DESC;`)
  .then(res => res.rows);
}
module.exports = getAllPublicQuizzes;
