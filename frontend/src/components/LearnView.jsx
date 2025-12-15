import React from 'react';
import UnitHeader from "./UnitHeader";
import PathNode from "./PathNode";
import { 
  MessageCircle, Star, Trophy, Headphones, Utensils, ShoppingBag, BookA, Pencil, Mic
} from 'lucide-react';
import MascotMama from "./MascotMama";
import MascotTola from "./MascotTola";

// --- Hardcoded Data Structure ---
const hardcodedUnits = [
  {
    id: 1,
    title: "Unit 1: A kọ́ ìtànkálẹ̀ àti ìrònú",
    description: "Lati ni oye ipilẹ ti awọn lẹta, awọn ohun kikọ ati ki o bẹrẹ si sọrọ.",
    color: "bg-green-600",
    lessons: [
      {
        id: "u1-l1",
        topic: "Iṣojuuṣe pẹlu Awọn Leta",
        icon: <Star size={32} strokeWidth={3} />,
        status: "completed",
        stars: 3,
        position: "center",
        colorClass: "bg-yellow-500 border-yellow-700",
        mascot: null
      },
      {
        id: "u1-l2",
        topic: "Ìmọ̀ Ẹ̀dá Ọ̀rọ̀",
        icon: <BookA size={28} strokeWidth={3} />,
        status: "completed",
        stars: 3,
        position: "left",
        colorClass: "bg-purple-500 border-purple-700",
        mascot: null
      },
      {
        id: "u1-l3",
        topic: "Ìtàn Àwọn Ọ̀rọ̀",
        icon: <MessageCircle size={28} strokeWidth={3} />,
        status: "active", // Current lesson
        stars: 0,
        position: "center",
        colorClass: "bg-green-500 border-green-700",
        mascot: <MascotTola /> // Active mascot here
      },
      {
        id: "u1-quiz",
        topic: "Unit Review",
        icon: <Trophy size={32} strokeWidth={3} />,
        status: "locked",
        stars: 0,
        position: "right",
        colorClass: "bg-orange-500 border-orange-700",
        mascot: null
      }
    ]
  },
  {
    id: 2,
    title: "Unit 2: Idagbasoke Orisun Omimi & Girama",
    description: "Loye girama ipilẹ, awọn ẹya ara, ati ibẹrẹ sisọ ede naa.",
    color: "bg-blue-600",
    lessons: [
      {
        id: "u2-l1",
        topic: "Awọn Isọtẹlẹ",
        icon: <Pencil size={28} strokeWidth={3} />,
        status: "locked",
        stars: 0,
        position: "center",
        colorClass: "bg-red-500 border-red-700",
        mascot: <MascotMama /> // Mama waiting at the next unit
      },
      {
        id: "u2-l2",
        topic: "Eto Ajọpọ",
        icon: <Headphones size={28} strokeWidth={3} />,
        status: "locked",
        stars: 0,
        position: "left",
        colorClass: "bg-teal-500 border-teal-700",
        mascot: null
      },
      {
        id: "u2-l3",
        topic: "Ibasepo Awọn Ọrọ",
        icon: <Utensils size={28} strokeWidth={3} />, // Assuming food vocab might come up, or just visual variety
        status: "locked",
        stars: 0,
        position: "center",
        colorClass: "bg-indigo-500 border-indigo-700",
        mascot: null
      },
      {
        id: "u2-quiz",
        topic: "Unit Challenge",
        icon: <Trophy size={32} strokeWidth={3} />,
        status: "locked",
        stars: 0,
        position: "right",
        colorClass: "bg-yellow-500 border-yellow-700",
        mascot: null
      }
    ]
  },
  {
    id: 3,
    title: "Unit 3: Market Life & Trade",
    description: "Bargaining, currency, and buying essentials.",
    color: "bg-purple-600",
    lessons: [
        {
          id: "u3-l1",
          topic: "Oja Lilo",
          icon: <ShoppingBag size={28} strokeWidth={3} />,
          status: "locked",
          stars: 0,
          position: "center",
          colorClass: "bg-pink-500 border-pink-700",
          mascot: null
        },
        {
          id: "u3-l2",
          topic: "Owó Níná",
          icon: <Mic size={28} strokeWidth={3} />,
          status: "locked",
          stars: 0,
          position: "left",
          colorClass: "bg-blue-500 border-blue-700",
          mascot: null
        }
    ]
  }
];

const LearnView = ({ onStartLesson }) => (
    <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
        <div className="w-full max-w-4xl mx-auto pb-20">
            
            {hardcodedUnits.map((unit) => (
                <div key={unit.id}>
                    {/* Render Unit Header */}
                    <UnitHeader 
                        title={unit.title} 
                        desc={unit.description} 
                        color={unit.color} 
                    />

                    {/* Render Path Nodes for this Unit */}
                    <div className="flex flex-col items-center mb-16 relative">
                        {/* The Winding Path Line background */}
                        <div className="absolute top-10 bottom-10 w-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>

                        {unit.lessons.map((lesson) => (
                            <PathNode 
                                key={lesson.id}
                                icon={lesson.icon} 
                                status={lesson.status} 
                                stars={lesson.stars} 
                                position={lesson.position} 
                                colorClass={lesson.colorClass} 
                                mascot={lesson.mascot}
                                // Only add click handler if active
                                onClick={lesson.status === 'active' ? onStartLesson : undefined}
                            />
                        ))}
                    </div>
                </div>
            ))}

        </div>
    </div>
);

export default LearnView;