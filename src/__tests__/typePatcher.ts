import { typePatcher } from "../index";
import mockProfessor from "../__mocks__/professor";
import typeDefs from "../__mocks__/types";

export function testProfessor(professor: any) {
    expect(professor.department.__typename).toEqual("Department");
    professor.classes.forEach((classVar: any) => {
        expect(classVar.__typename).toEqual("Class");

        classVar.enrolled_students.forEach((student: any) => {
            expect(student.__typename).toEqual("Student");
        });
    });
    professor.scolarship_applications.forEach((application: any) => {
        expect(application.__typename).toEqual("ScolarshipApplication");
        expect(application.co_assistant_professor.__typename).toEqual("Professor");

        expect(application.process.insurance.__typename).toEqual("Insurance");
    });
}

describe("typePatcher factory", () => {
    const patcher = typePatcher(typeDefs);
    const professor: any = mockProfessor();
    patcher.Professor(professor);

    it("should create the correct number of patcher functions", () => {
        const EXPECTED_QUERIABLE_TYPES = ["Professor", "Class", "ScolarshipApplication"];

        const numberOfPatchFunctions = Object.keys(patcher).filter(key => key !== "self");

        expect(numberOfPatchFunctions.sort()).toEqual(EXPECTED_QUERIABLE_TYPES.sort());
    });

    it("should corretly create and apply type patcher functions", () => {
        testProfessor(professor);
    });
});
