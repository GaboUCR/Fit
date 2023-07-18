import { useContext, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';

const Workout = () => {
  const {username, activeExercises, setActiveExercises } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    try {
      const storedExercises = localStorage.getItem('activeExercises');
      if (storedExercises) {
        const parsedExercises = JSON.parse(storedExercises);
        if (parsedExercises && typeof parsedExercises === 'object') {
          setActiveExercises(parsedExercises);
        }
      }
    } catch (error) {
      console.error("Error loading exercises from localStorage:", error);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('activeExercises', JSON.stringify(activeExercises));
    } catch (error) {
      console.error("Error saving exercises to localStorage:", error);
    }
    
  }, [activeExercises]);
  

  const handleCheck = (exerciseName, instanceId) => {
    const updatedExercises = {
      ...activeExercises,
      [exerciseName]: {
        ...activeExercises[exerciseName],
        isComplete: !activeExercises[exerciseName].isComplete,
        instanceId: instanceId
      }
    };
    console.log('handleCheck:', updatedExercises);
    setActiveExercises(updatedExercises);
    localStorage.setItem('activeExercises', JSON.stringify(updatedExercises));
  };

  const handleFinishWorkout = () => {
    const completedExercises = Object.entries(activeExercises)
      .filter(([name, { isComplete }]) => isComplete)
      .map(([name, { instanceId }]) => ({ name, instanceId }));

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

    setActiveExercises({});
  };

  return (
    <Container>
      <h2>Mi entrenamiento</h2>
      <ListGroup>
        {Object.entries(activeExercises).map(([exerciseName, { amount, unit, isComplete, instanceId }]) => (
          <ListGroup.Item key={exerciseName}>
            <input
              type="checkbox"
              checked={isComplete}
              onChange={() => handleCheck(exerciseName, instanceId)}
            />
            {' '}
            {exerciseName} - {amount} {unit}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={handleFinishWorkout}>Terminar rutina</Button>
    </Container>
  );
};

export default Workout;
