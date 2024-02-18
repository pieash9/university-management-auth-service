import initAcademicFacultyEvents from '../modules/academicFaculty/academicFaculty.events';
import initAcademicSemesterEvents from '../modules/academicSemester/academicSemester.event';

const subscribeToEvents = async () => {
  initAcademicSemesterEvents();
  initAcademicFacultyEvents();
};

export default subscribeToEvents;
