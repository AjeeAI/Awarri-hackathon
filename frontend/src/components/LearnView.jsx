import React, { useState, useEffect } from 'react';
import UnitHeader from "./UnitHeader";
import PathNode from "./PathNode";
import { 
  MessageCircle, Star, Trophy, Headphones, Utensils, ShoppingBag, 
  BookA, Pencil, Mic, Target, Lightbulb
} from 'lucide-react';
import MascotMama from "./MascotMama";
import MascotTola from "./MascotTola";

// Helper to assign icons based on topic keywords
const getIconForTopic = (topic = "") => {
  const lowerTopic = topic.toLowerCase();
  if (lowerTopic.includes("goal") || lowerTopic.includes("intro")) return <Target size={28} strokeWidth={3} />;
  if (lowerTopic.includes("listen")) return <Headphones size={28} strokeWidth={3} />;
  if (lowerTopic.includes("speak") || lowerTopic.includes("conversation")) return <MessageCircle size={28} strokeWidth={3} />;
  if (lowerTopic.includes("read")) return <BookA size={28} strokeWidth={3} />;
  if (lowerTopic.includes("writ")) return <Pencil size={28} strokeWidth={3} />;
  if (lowerTopic.includes("review") || lowerTopic.includes("quiz")) return <Trophy size={28} strokeWidth={3} />;
  return <Star size={28} strokeWidth={3} />; // Default
};

const LearnView = ({ onStartLesson }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurriculum = () => {
      try {
        // 1. Get raw string
        const storedData = localStorage.getItem('userCurriculum');
        
        if (!storedData) {
          console.log("No curriculum found in localStorage");
          setLoading(false);
          return;
        }

        // 2. Parse JSON
        const parsedData = JSON.parse(storedData);

        // 3. Map Data to UI Structure
        // We use the 'weeks' array from your snippet
        const mappedUnits = (parsedData.weeks || []).map((week, unitIndex) => {
          
          // Cycle through colors for units
          const unitColors = ["bg-green-600", "bg-blue-600", "bg-purple-600", "bg-orange-600"];
          const unitColor = unitColors[unitIndex % unitColors.length];

          return {
            id: week.week, // e.g., 1
            title: `Week ${week.week}: ${week.theme}`,
            description: week.objectives,
            color: unitColor,
            lessons: (week.sessions || []).map((session, sessionIndex) => {
              
              // --- MOCK STATUS LOGIC ---
              // Since your JSON doesn't have 'status', we simulate it:
              // Week 1, Session 1 is 'active'. Everything else is 'locked'.
              // You can change this logic later to read from a separate 'userProgress' object.
              let status = 'locked';
              if (unitIndex === 0 && sessionIndex === 0) status = 'active';
              
              // Cycle positions: Center -> Left -> Center -> Right
              const positions = ["center", "left", "center", "right"];
              const pos = positions[sessionIndex % positions.length];

              // Assign specific colors for nodes
              const nodeColors = [
                "bg-yellow-500 border-yellow-700",
                "bg-purple-500 border-purple-700", 
                "bg-green-500 border-green-700",
                "bg-red-500 border-red-700"
              ];
              const nodeColor = nodeColors[sessionIndex % nodeColors.length];

              return {
                id: `w${week.week}-s${session.session}`,
                topic: session.topic,
                icon: getIconForTopic(session.topic),
                status: status,
                stars: 0, // Placeholder
                position: pos,
                colorClass: nodeColor,
                // Put MascotTola on the active lesson
                mascot: status === 'active' ? <MascotTola /> : null
              };
            })
          };
        });

        setUnits(mappedUnits);
      } catch (err) {
        console.error("Failed to parse curriculum:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCurriculum();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading your path...</div>;
  
  if (units.length === 0) return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold mb-2">No Curriculum Found</h2>
      <p className="text-slate-500">Please generate a curriculum to see your learning path.</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
        <div className="w-full max-w-4xl mx-auto pb-20">
            
            {units.map((unit) => (
                <div key={unit.id}>
                    <UnitHeader 
                        title={unit.title} 
                        desc={unit.description} 
                        color={unit.color} 
                    />

                    <div className="flex flex-col items-center mb-16 relative">
                        {/* Winding Path Background Line */}
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
                                onClick={lesson.status === 'active' ? onStartLesson : undefined}
                            />
                        ))}
                    </div>
                </div>
            ))}

        </div>
    </div>
  );
};

export default LearnView;