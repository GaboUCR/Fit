import React, { useEffect, useState } from "react";
import { Container, ListGroup, Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { AuthContext } from './AuthProvider';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Routines = () => {
  const { username, activeExercises, setActiveExercises } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);
  const [routineData, setRoutineData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();  

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

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const addToWorkout = (exercises) => {
    setActiveExercises(
      exercises.map((exercise) => ({
        ...exercise,
        isComplete: false
      }))
    );
    navigate("/workout");
  };
  
  const handleSaveRoutine = () => {
    if (routineData === "") {
      alert("El formulario está vacío. Por favor ingresa la información de la rutina.");
      return;
    }

    fetch(`http://localhost:3001/update-routine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username, routineData}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Aquí puedes manejar la respuesta del servidor
        handleClose();
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container className="mt-3">
      <h2 className="text-center">Mis Rutinas</h2>
      <Button variant="primary" onClick={handleShow}>
        Añadir o modificar rutina
      </Button>
      <Row>
        {routines.map((routine, i) => (
          <Col md={6} lg={4} key={i}>
            <Card className="my-3">
              <Card.Header as="h5">
                {routine.name}
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {routine.exercises.map((exercise, j) => (
                    <ListGroup.Item key={j}>
                      <strong>{exercise.name}</strong> - {exercise.amount} {exercise.unit}
                    </ListGroup.Item>
                  ))}
                </ListGroup> {/* Aquí debes cerrar el ListGroup */}
                {/* Añade aquí el botón addToWorkout */}
                <Button variant="secondary" className="mt-2" onClick={() => addToWorkout(routine.exercises)}>
                  Agregar a mi entrenamiento
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir o modificar rutina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Por favor, escribe los datos de la rutina en el siguiente formato:</p>
          <p>NombreRutina<br />
          nombreEjercicio - cantidad unidades<br />
          nombreEjercicio - cantidad unidades<br />
          nombreEjercicio - cantidad unidades</p>
          <Form.Control
            as="textarea"
            rows={6}
            value={routineData}
            onChange={(e) => setRoutineData(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveRoutine}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Routines;

