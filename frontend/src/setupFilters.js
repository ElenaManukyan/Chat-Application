import leoProfanity from 'leo-profanity';

const setupFilters = () => {  
  const russianWords = leoProfanity.getDictionary('ru');
  const englishWords = leoProfanity.getDictionary('en');

  leoProfanity.add(russianWords);
  leoProfanity.add(englishWords);
};

export default setupFilters;
