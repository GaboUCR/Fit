import React, { useContext, useEffect, useState } from 'react';
import { Container, ListGroup, Card } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';

const UserExercises = () => {
  const [exercises, setExercises] = useState({});
  const {username} = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtén el token desde localStorage

    fetch('http://localhost:3001/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Adjunta el token al header
      },
      body: JSON.stringify({username: username}) // Envia el username en el cuerpo de la petición
    })
      .then((res) => res.json())
      .then((data) => {
        const exercisesByDate = data.reduce((obj, exercise) => {
          const date = exercise.date;
          if (!obj[date]) {
            obj[date] = [];
          }
          obj[date].push(exercise);
          return obj;
        }, {});
        setExercises(exercisesByDate);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [username]);

  const sortedDates = Object.keys(exercises).sort((a, b) => new Date(b) - new Date(a));

  return (
    <Container className="mt-3">
      <h2 className="text-center">Exercises for {username}</h2>
      {sortedDates.map((date, index) => (
        <Card className="my-3" key={index}>
          <Card.Header as="h5">{date}</Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {exercises[date].map((exercise, index) => (
                <ListGroup.Item key={index}>
                  <strong>{exercise.name}</strong> - {exercise.amount} {exercise.unit}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default UserExercises;
