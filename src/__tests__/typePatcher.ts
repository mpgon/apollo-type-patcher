import typePatcher from "../index";
import mockProfessor from "../__mocks__/professor";
import mockTypes from "../__mocks__/types";

describe("typePatcher factory", () => {
  const patcher = typePatcher(mockTypes);
  const professor: any = mockProfessor();
  patcher.Professor(professor);

  it("should create the correct number of patcher functions", () => {
    const EXPECTED_QUERIABLE_TYPES = [
      "Professor",
      "Class",
      "ScolarshipApplication"
    ];

    const numberOfPatchFunctions = Object.keys(patcher).filter(
      key => key !== "self"
    );

    expect(numberOfPatchFunctions.sort()).toEqual(
      EXPECTED_QUERIABLE_TYPES.sort()
    );
  });

  it("should corretly create and apply type patcher functions", () => {
    expect(professor.department.__typename).toEqual("Department");
    professor.classes.forEach((classVar: any) => {
      expect(classVar.__typename).toEqual("Class");

      classVar.enrolled_students.forEach((student: any) => {
        expect(student.__typename).toEqual("Student");
      });
    });
    professor.scolarship_applications.forEach((application: any) => {
      expect(application.__typename).toEqual("ScolarshipApplication");

      expect(application.process.insurance.__typename).toEqual("Insurance");
    });
  });
});
