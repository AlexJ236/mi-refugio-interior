import React from 'react';
import DailyCardItem from './DailyCardItem';
import '../../styles/components/DailyCard.css';

const DailyCardList = ({ cards, onDeleteCard }) => {
  if (!cards || cards.length === 0) {
    return <p className="daily-card-list-empty">Aún no has escrito capítulos en tu diario. ¡Anímate a plasmar tus vivencias! Cada día es una nueva página llena de amor.</p>;
  }

  return (
    <ul className="daily-card-list">
      {cards.map(card => (
        <DailyCardItem key={card.$id} card={card} onDelete={onDeleteCard} />
      ))}
    </ul>
  );
};

export default DailyCardList;