import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Form, Card, Row, Col } from "react-bootstrap";
import { AuthContext } from './AuthProvider';
import { useContext } from "react";

const Routines = () => {
  const { username } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const token = localStorage.getItem('token');
  
  useEffect(() => {

    fetch("http://localhost:3001/user-routines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({username: username}) 
    })
      .then((res) => res.json())
      .then((data) => {
        let routinesArray = Object.entries(data).map(([routineName, exercises]) => ({name: routineName, exercises}));
        setRoutines(routinesArray);
      })
      .catch((error) => console.error("Error:", error));
  }, [username]);

  const handleAddExercise = () => {
    if (!selectedRoutine) {
      alert("Seleccione una rutina primero");
      return;
    }

    fetch(`http://localhost:3001/routine/${selectedRoutine.name}/exercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newExerciseName }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedRoutines = routines.map((routine) =>
          routine.name === selectedRoutine.name
            ? { ...routine, exercises: [...routine.exercises, data] }
            : routine
        );
        setRoutines(updatedRoutines);
        setNewExerciseName("");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container className="mt-3">
      <h2 className="text-center">Mis Rutinas</h2>
      <Row>
        {routines.map((routine, i) => (
          <Col md={6} lg={4} key={i}>
            <Card className="my-3">
              <Card.Header as="h5" onClick={() => setSelectedRoutine(routine)}>
                {routine.name}
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {routine.exercises.map((exercise, j) => (
                    <ListGroup.Item key={j}>
                      <strong>{exercise.name}</strong>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Form>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Nombre del nuevo ejercicio"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
          />
          <Button className="mt-3" variant="primary" onClick={handleAddExercise}>
            Añadir ejercicio
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Routines;
