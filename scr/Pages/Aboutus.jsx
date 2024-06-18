import React from 'react';
import './Aboutus.css';
import { FaVk, FaTelegram, FaTwitter } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Митрофанский Александр',
    role: 'Fullstack Developer',
    photo: 'https://cdn.stepik.net/media/users/615189842/1684470727-cugACKm/avatar.png',
    description: 'Александр занимается разработкой базы данных, а также разработкой интерфейса дополнительных вкладок.',
    social: {
      vk: 'https://vk.com/zabaaavchik',
      telegram: 'https://t.me/Alex_Miitr',
      twitter: 'https://www.youtube.com/watch?v=mCdA4bJAGGk&t=4s'
    }
  },
  {
    name: 'Колупаев Вячеслав',
    role: 'Fullstack Developer',
    photo: 'https://cdn.stepik.net/media/users/296909660/avatar.png',
    description: 'Вячеслав работает над разработкой интерфейса нашего проекта, а также функциональных возможностей.',
    social: {
      vk: 'https://vk.com/id.zxcd',
      telegram: 'https://t.me/monopolyaaaaa',
      twitter: 'https://www.youtube.com/watch?v=vTEKeUrEDjw&t=1s'
    }
  },
  {
    name: 'Просвирин Андрей',
    role: 'Backend Developer',
    photo: 'https://static.cdn.asset.aparat.com/profile-photo/8356152-964844-m.jpg',
    description: 'Андрей разрабатывает базу данных для хранения требуемой информации и учествует в её интеграции.',
    social: {
      vk: 'https://vk.com/idprosvirin',
      telegram: 'https://t.me/prosvirin_a',
      twitter: 'https://twitter.com/alexeipetrov'
    }
  }
];

const TeamMember = ({ member }) => (
  <div className="team-member">
    <div className="photo-container">
      <img src={member.photo} alt={member.name} className="photo" />
      <div className="overlay">
        <div className="text">{member.description}</div>
      </div>
    </div>
    <h2>{member.name}</h2>
    <p>{member.role}</p>
    <div className="social-links">
      <a href={member.social.vk} target="_blank" rel="noopener noreferrer">
        <FaVk />
      </a>
      <a href={member.social.telegram} target="_blank" rel="noopener noreferrer">
        <FaTelegram />
      </a>
      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
        <FaTwitter />
      </a>
    </div>
  </div>
);

function Aboutus() {
  return (
    <div className="aboutus">
      <div className="introus">
        <h2>О нас</h2>
        <p>Добро пожаловать на наш сайт!</p>
        <p>Мы – группа студентов из Иркутского государственного исследовательского технического университета, увлеченных разработкой веб-приложений. Наша команда была основана в 2024 году с целью разработать веб-приложение для автоматизации создания телефонных интервью. С самого начала мы стремились создать качественное и удобное приложение для наших пользователей, сочетая инновационные решения и свежие идеи.</p>
        <p>Мы гордимся нашей командой молодых и талантливых профессионалов, которые, несмотря на свой студенческий статус, уже успели зарекомендовать себя в этом. В нашей команде мы верим в важность индивидуального подхода к каждому клиенту, потому что ваша удовлетворенность – наш главный приоритет.</p>
        <p>Наши основные ценности включают:</p>
        <ul>
          <li><strong>Качество:</strong> Мы всегда стремимся к совершенству и гарантируем высокие стандарты во всем, что делаем</li>
          <li><strong>Иновации:</strong> Мы постоянно развиваемся и внедряем новейшие технологии, чтобы создавать качественный и отвечающий современным требованиям продукт</li>
          <li><strong>Честность:</strong> Мы строим доверительные отношения с нашими клиентами и партнёрами, основываясь на прозрачности и честности</li>
        </ul>
        <p>Как студенты, мы видим огромный потенциал для роста и развития нашего продукта. Мы постоянно учимся и адаптируемся к новым вызовам, чтобы предлагать вам самые передовые и эффективные решения. Мы убеждены, что впереди нас ждет много интересных и значимых проектов.</p>
        <p>Благодарим вас за интерес к нашей компании. Мы с нетерпением ждем возможности работать с вами и помочь вам достичь ваших целей.</p>
      </div>
      <h1>Наша команда</h1>
      <div className="team">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
    </div>
  );
}

export default Aboutus;
