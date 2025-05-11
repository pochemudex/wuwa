import React, { useEffect, useState } from 'react';
import { getCharacterImages } from './supabaseClient';

interface Character {
  name: string;
  nameRu: string;
  image: string;
  element: string;
  stars: number;
  bestPaidWeapon: string;
  bestPaidWeaponImg?: string;
  bestFreeWeapon: string;
  bestFreeWeaponImg?: string;
}

const characters: Character[] = [
  {
    name: "Jiyan",
    nameRu: "Цзиянь",
    image: "jiyan.png",
    element: "Wind",
    stars: 5,
    bestPaidWeapon: "Verdant Summit",
    bestPaidWeaponImg: "/images/paid_weapon.png", // заглушка
    bestFreeWeapon: "Lustrous Razor",
    bestFreeWeaponImg: "/images/free_weapon.png" // заглушка
  },
  {
    name: "Yinlin",
    nameRu: "Иньлинь",
    image: "yinlin.jpg",
    element: "Electro",
    stars: 5,
    bestPaidWeapon: "Stringmaster",
    bestPaidWeaponImg: "/images/paid_weapon.png",
    bestFreeWeapon: "Cosmic Ripples",
    bestFreeWeaponImg: "/images/free_weapon.png"
  },
  // Добавьте других персонажей здесь
];

const elementColors: Record<string, string> = {
  Wind: 'bg-green-200 text-green-800',
  Electro: 'bg-purple-200 text-purple-800',
  Fire: 'bg-orange-200 text-orange-800',
  Ice: 'bg-blue-200 text-blue-800',
  // Добавьте другие элементы при необходимости
};

function StarBadge({ stars }: { stars: number }) {
  const color = stars === 5 ? 'bg-yellow-400 text-yellow-900' : 'bg-purple-500 text-white';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{stars} ★</span>
  );
}

function App() {
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    getCharacterImages()
      .then((images) => {
        const map: Record<string, string> = {};
        images.forEach(img => {
          map[img.name.toLowerCase()] = img.url;
        });
        setImageMap(map);
        setLoading(false);
      })
      .catch((err) => {
        alert('Ошибка Supabase: ' + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 md:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Гайды по персонажам Wuthering Waves</h1>
      {loading && <div className="text-center mb-4">Загрузка картинок...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {characters.map((character, idx) => {
          const imgSrc = imageMap[character.image.toLowerCase()] || `/images/${character.image}`;
          const isOpen = openIndex === idx;
          return (
            <div key={character.name} className="bg-white rounded-xl shadow p-4 flex flex-col">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setOpenIndex(isOpen ? null : idx)}>
                <img
                  src={imgSrc}
                  alt={character.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-gray-900 truncate">{character.name} / {character.nameRu}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${elementColors[character.element] || 'bg-gray-200 text-gray-800'}`}>{character.element}</span>
                    <span className="ml-2"><StarBadge stars={character.stars} /></span>
                  </div>
                </div>
                <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              {isOpen && (
                <div className="mt-4 flex flex-col gap-4">
                  <div>
                    <div className="font-medium mb-1">Платное:</div>
                    <div className="flex items-center gap-3">
                      <img src={character.bestPaidWeaponImg} alt={character.bestPaidWeapon} className="w-16 h-16 object-cover rounded" />
                      <span>{character.bestPaidWeapon}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Бесплатное:</div>
                    <div className="flex items-center gap-3">
                      <img src={character.bestFreeWeaponImg} alt={character.bestFreeWeapon} className="w-16 h-16 object-cover rounded" />
                      <span>{character.bestFreeWeapon}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App; 