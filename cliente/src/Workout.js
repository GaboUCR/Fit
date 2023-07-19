import { useContext, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';

const Workout = () => {
  const {username, activeExercises, setActiveExercises } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    try {
      localStorage.setItem('activeExercises', JSON.stringify(activeExercises));
    } catch (error) {
      console.error("Error saving exercises to localStorage:", error);
    }
  }, [activeExercises]);
  
  const handleCheck = (index) => {
    const updatedExercises = activeExercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, isComplete: !exercise.isComplete };
      }
      return exercise;
    });
    setActiveExercises(updatedExercises);
    localStorage.setItem('activeExercises', JSON.stringify(updatedExercises));
  };

  const handleFinishWorkout = () => {
    const completedExercises = activeExercises.filter(exercise => exercise.isComplete);
    
    var fechaActual = new Date().toLocaleDateString();
    
    fetch('http://localhost:3001/add-workout', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({username, completedExercises, date:fechaActual}),
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    setActiveExercises([]);
  };

  return (
    <Container>
      <h2>Mi entrenamiento</h2>
      <ListGroup>
        {activeExercises.map(({ name, amount, unit, isComplete }, index) => (
          <ListGroup.Item key={index}>
            <input
              type="checkbox"
              checked={isComplete}
              onChange={() => handleCheck(index)}
            />
            {' '}
            {name} - {amount} {unit}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={handleFinishWorkout}>Terminar rutina</Button>
    </Container>
  );
};

export default Workout;
