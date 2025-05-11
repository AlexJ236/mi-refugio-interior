import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/pages/ContentPage.css';

const EmotionsExplainedPage = () => {
  return (
    <div className="content-page container">
      <h1 className="page-title">Un Viaje al Corazón de tus Emociones</h1>
      <p className="page-subtitle">
        Comprender tus emociones es como tener un mapa para navegar tu mundo interior con más sabiduría y compasión.
      </p>

      <section className="content-section">
        <h2>¿Qué son las Emociones?</h2>
        <p>
          Las emociones son respuestas naturales a lo que sucede dentro y alrededor de ti. Son mensajeras que te dan información valiosa sobre tus necesidades, tus límites y tus experiencias. No hay emociones "buenas" o "malas"; todas tienen un propósito y una función.
        </p>
        <p>
          Piensa en ellas como el clima de tu interior: a veces soleado, a veces lluvioso, a veces tormentoso. Aprender a observarlas sin juicio es el primer paso para regularlas con amor.
        </p>
      </section>

      <section className="content-section">
        <h2>Emociones Primarias: Los Colores Básicos de tu Paleta</h2>
        <p>
          Las emociones primarias son respuestas innatas y universales. Son como los colores primarios de tu paleta emocional, a partir de los cuales se pueden formar muchas otras. Algunas de las más reconocidas son:
        </p>
        <ul>
          <li><strong>Alegría:</strong> Te impulsa a conectar, celebrar y disfrutar.</li>
          <li><strong>Tristeza:</strong> Te ayuda a procesar pérdidas, pedir apoyo y valorar lo que es importante.</li>
          <li><strong>Ira:</strong> Te moviliza para defenderte, superar obstáculos o luchar contra injusticias.</li>
          <li><strong>Miedo:</strong> Te alerta ante peligros y te prepara para protegerte.</li>
          <li><strong>Sorpresa:</strong> Orienta tu atención hacia algo nuevo o inesperado.</li>
          <li><strong>Aversión (o Asco):</strong> Te protege de cosas que podrían ser dañinas o desagradables.</li>
          <li><strong>Confianza:</strong> Te permite explorar, vincularte y sentir seguridad.</li>
          <li><strong>Anticipación:</strong> Te prepara para eventos futuros, enfocando tu atención y energía.</li>
        </ul>
        <p>
          Observar estas emociones básicas en ti puede ayudarte a entender mejor tus reacciones iniciales a las situaciones.
        </p>
      </section>

      <section className="content-section">
        <h2>Emociones Secundarias: Matices y Combinaciones</h2>
        <p>
          Las emociones secundarias suelen ser una mezcla o una reacción a las emociones primarias. A menudo están más influenciadas por nuestros pensamientos, creencias y experiencias pasadas. Algunos ejemplos:
        </p>
        <ul>
          <li><strong>Culpa:</strong> Puede surgir de sentir que hemos violado un valor o dañado a alguien (relacionada con tristeza, miedo).</li>
          <li><strong>Vergüenza:</strong> Una sensación dolorosa sobre quiénes somos, a menudo relacionada con el miedo al juicio o rechazo.</li>
          <li><strong>Celos:</strong> Una mezcla compleja que puede incluir miedo (a la pérdida), ira (hacia un rival o la situación) y tristeza.</li>
          <li><strong>Ansiedad:</strong> A menudo una combinación de miedo y anticipación sobre un peligro o resultado negativo futuro.</li>
          <li><strong>Amor:</strong> Una combinación poderosa de alegría y confianza (según Plutchik).</li>
          <li><strong>Optimismo:</strong> Una mezcla de anticipación y alegría.</li>
        </ul>
        <p>
          Reconocer las emociones secundarias y tratar de identificar las emociones primarias subyacentes puede ser muy útil. Por ejemplo, si sientes mucha ansiedad, ¿hay un miedo específico debajo? Si sientes culpa, ¿qué valor sientes que has transgredido y qué emoción primaria (como tristeza por el daño causado) está ahí?
        </p>
         <p>
          Puedes explorar más sobre esto con la{" "}
          <Link to="/daily-card/new" style={{fontWeight: 'bold'}}>herramienta de "Rueda de Emociones"</Link>{" "}
          al registrar tu tarjeta diaria.
        </p>
      </section>

      <section className="content-section">
        <h2>El Mensaje de tus Emociones</h2>
        <p>
          Cada emoción lleva un mensaje. Intenta preguntarte:
        </p>
        <ul>
          <li>¿Qué me está tratando de decir esta emoción?</li>
          <li>¿Qué necesidad mía podría estar señalando?</li>
          <li>¿Hay algo en mi entorno o en mis pensamientos que la está provocando?</li>
        </ul>
        <p>
          Escuchar con curiosidad y sin juicio es clave. Si una emoción es muy intensa o persistente y te causa malestar significativo, recuerda que hay <Link to="/skills" style={{fontWeight: 'bold'}}>habilidades TDC</Link> que pueden ayudarte a navegarla y, si es necesario, buscar apoyo siempre es un acto de valentía y amor propio.
        </p>
      </section>
       <div className="text-center mt-lg">
            <Link to="/skills/mindfulness">
                <Button variant="secondary">Explorar Mindfulness para observar emociones</Button>
            </Link>
        </div>
    </div>
  );
};

export default EmotionsExplainedPage;