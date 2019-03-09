export default function mockProfessor() {
  return {
    id: 0,
    name: "Professor Alice Fontoura",
    department: { id: 6, name: "Applied Sciences" },
    classes: [
      {
        id: 1,
        year: 2008,
        enrolled_students: [
          { id: 50, name: "Pedro Fontoura" },
          { id: 51, name: "Salome Apitz" }
        ]
      },
      {
        id: 2,
        year: 2009,
        enrolled_students: [
          { id: 60, name: "Ahsd Djkqw" },
          { id: 61, name: "Kielsd Juilks" }
        ]
      }
    ],
    scolarship_applications: [
      {
        id: 500,
        student_id: 50,
        process: {
          program_name: "Erasmus",
          process_status: 1,
          insurance: {
            id: 99,
            name: "KAI GmbH"
          }
        }
      },
      {
        id: 501,
        student_id: 50,
        process: {
          program_name: "Erasmus",
          process_status: 1,
          insurance: {
            id: 100,
            name: "Ubehu GmbH"
          }
        }
      }
    ]
  };
}
