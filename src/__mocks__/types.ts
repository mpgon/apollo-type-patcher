export default {
  Professor: {
    department: "Department",
    __nested: {
      classes: "Class",
      scolarship_applications: "ScolarshipApplication"
    }
  },
  Class: {
    enrolled_students: "Student"
  },
  ScolarshipApplication: {
    "process.insurance": "Insurance"
  }
};
