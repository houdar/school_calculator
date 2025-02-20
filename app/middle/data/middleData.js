// data/streams.js

/**
 * @typedef {Object} Subject
 * @property {string} name - The name of the subject.
 * @property {number} multiplier - The subject multiplier.
 * @property {boolean} isConsernabl - Whether the subject is considered or not.
 */

/**
 * @typedef {Object} SchoolStream
 * @property {string} name - The name of the stream/year.
 * @property {Subject[]} subjects - An array of all subjects for that year.
 * @property {Subject[]} specialSubjects - An array of special subjects.
 */

// --------------------- FIRST YEAR ---------------------

const firstSubjects = [
    { name: "العلوم", multiplier: 1, isConsernabl: false },
    { name: "الرياضيات", multiplier: 2, isConsernabl: false },
    { name: "الفيزياء", multiplier: 1, isConsernabl: false },
    { name: "العربية", multiplier: 2, isConsernabl: false },
    { name: "الفرنسية", multiplier: 1, isConsernabl: false },
    { name: "المدنية", multiplier: 1, isConsernabl: false },
    { name: "الانجليزية", multiplier: 1, isConsernabl: false },
    { name: "الاسلامية", multiplier: 1, isConsernabl: false },
    { name: "الاعلام الالي", multiplier: 1, isConsernabl: true },
    { name: "الاجتماعيات", multiplier: 1, isConsernabl: false },
    { name: "الفن", multiplier: 1, isConsernabl: true },
    { name: "الامازيغية", multiplier: 1, isConsernabl: true },
    { name: "الرياضة", multiplier: 1, isConsernabl: true },
  ];
  
  export const firstStream = {
    name: "السنة الاولى",
    subjects: firstSubjects,
    specialSubjects: [
      firstSubjects.find((s) => s.name === "العربية"),
      firstSubjects.find((s) => s.name === "الرياضيات"),
      firstSubjects.find((s) => s.name === "الفرنسية"),
    ],
  };
  
  // --------------------- SECOND YEAR ---------------------
  
  const secondSubjects = [
    { name: "العلوم", multiplier: 2, isConsernabl: false },
    { name: "الرياضيات", multiplier: 3, isConsernabl: false },
    { name: "الفيزياء", multiplier: 2, isConsernabl: false },
    { name: "العربية", multiplier: 3, isConsernabl: false },
    { name: "الفرنسية", multiplier: 2, isConsernabl: false },
    { name: "الاعلام الالي", multiplier: 1, isConsernabl: true },
    { name: "المدنية", multiplier: 1, isConsernabl: false },
    { name: "الانجليزية", multiplier: 1, isConsernabl: false },
    { name: "الاسلامية", multiplier: 1, isConsernabl: false },
    { name: "الاجتماعيات", multiplier: 2, isConsernabl: false },
    { name: "الفن", multiplier: 1, isConsernabl: true },
    { name: "الامازيغية", multiplier: 1, isConsernabl: true },
    { name: "الرياضة", multiplier: 1, isConsernabl: true },
  ];
  
  export const secondStream = {
    name: "السنة الثانية",
    subjects: secondSubjects,
    specialSubjects: [
      secondSubjects.find((s) => s.name === "العربية"),
      secondSubjects.find((s) => s.name === "الرياضيات"),
      secondSubjects.find((s) => s.name === "الفرنسية"),
    ],
  };
  
  // --------------------- THIRD YEAR ---------------------
  
  const thirdSubjects = [
    { name: "العلوم", multiplier: 2, isConsernabl: false },
    { name: "الرياضيات", multiplier: 3, isConsernabl: false },
    { name: "الفيزياء", multiplier: 2, isConsernabl: false },
    { name: "العربية", multiplier: 3, isConsernabl: false },
    { name: "الفرنسية", multiplier: 2, isConsernabl: false },
    { name: "الاعلام الالي", multiplier: 1, isConsernabl: true },
    { name: "المدنية", multiplier: 1, isConsernabl: false },
    { name: "الانجليزية", multiplier: 1, isConsernabl: false },
    { name: "الاسلامية", multiplier: 1, isConsernabl: false },
    { name: "الاجتماعيات", multiplier: 2, isConsernabl: false },
    { name: "الفن", multiplier: 1, isConsernabl: true },
    { name: "الامازيغية", multiplier: 1, isConsernabl: true },
    { name: "الرياضة", multiplier: 1, isConsernabl: true },
  ];
  
  export const thirdStream = {
    name: "السنة الثالثة",
    subjects: thirdSubjects,
    specialSubjects: [
      thirdSubjects.find((s) => s.name === "العربية"),
      thirdSubjects.find((s) => s.name === "الرياضيات"),
      thirdSubjects.find((s) => s.name === "الفرنسية"),
    ],
  };
  
  // --------------------- FOURTH YEAR ---------------------
  
  const fourthSubjects = [
    { name: "العلوم", multiplier: 2, isConsernabl: false },
    { name: "الرياضيات", multiplier: 4, isConsernabl: false },
    { name: "الفيزياء", multiplier: 2, isConsernabl: false },
    { name: "العربية", multiplier: 5, isConsernabl: false },
    { name: "الفرنسية", multiplier: 3, isConsernabl: false },
    { name: "المدنية", multiplier: 1, isConsernabl: false },
    { name: "الاعلام الالي", multiplier: 1, isConsernabl: true },
    { name: "الانجليزية", multiplier: 2, isConsernabl: false },
    { name: "الاسلامية", multiplier: 2, isConsernabl: false },
    { name: "الاجتماعيات", multiplier: 3, isConsernabl: false },
    { name: "الفن", multiplier: 1, isConsernabl: true },
    { name: "الامازيغية", multiplier: 2, isConsernabl: true },
    { name: "الرياضة", multiplier: 1, isConsernabl: true },
  ];
  
  export const fourthStream = {
    name: "السنة الرابعة",
    subjects: fourthSubjects,
    specialSubjects: [
      fourthSubjects.find((s) => s.name === "العربية"),
      fourthSubjects.find((s) => s.name === "الرياضيات"),
      fourthSubjects.find((s) => s.name === "الفرنسية"),
    ],
  };
  