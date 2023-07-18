import { useContext, useState } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';

const Workout = () => {
  const {activeExercises, setActiveExercises} = useContext(AuthContext);

  const handleCheck = (exerciseName) => {
    setActiveExercises(prevExercises => ({
      ...prevExercises,
      [exerciseName]: !prevExercises[exerciseName]
    }));
  };

  return (
    <Container>
      <h2>Mi entrenamiento</h2>
      <ListGroup>
        {Object.entries(activeExercises).map(([exerciseName, isComplete]) => (
          <ListGroup.Item key={exerciseName}>
            <input
              type="checkbox"
              checked={isComplete}
              onChange={() => handleCheck(exerciseName)}
            />
            {' '}
            {exerciseName}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Workout;
