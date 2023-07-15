import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const UserExercises = ({ username }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/user/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setExercises(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [username]);

  return (
    <Container>
      <h2>Exercises for {username}</h2>
      <ListGroup>
        {exercises.map((exercise, index) => (
          <ListGroup.Item key={index}>
            <strong>{exercise.name}</strong> - {exercise.amount} {exercise.unit}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default UserExercises;
