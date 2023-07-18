import { useContext, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';

const Workout = () => {
  const { activeExercises, setActiveExercises } = useContext(AuthContext);

  // Al montar el componente, verifica si hay ejercicios almacenados en localStorage
  // Si hay, los carga en el estado del componente
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
    if (Object.keys(activeExercises).length > 0) {
      console.log('useEffect:activeExercises:', activeExercises);
      try {
        localStorage.setItem('activeExercises', JSON.stringify(activeExercises));
      } catch (error) {
        console.error("Error saving exercises to localStorage:", error);
      }
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

    fetch('http://your-server-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completedExercises),
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
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
