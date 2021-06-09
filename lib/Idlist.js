'use strict'

const IdListDB = require('../databases/IdListDB_handler')

const getClasses = require('./getClasses')
const getTeachers = require('./getTeachers')
const getStudents = require('./getStudents')

const Idlist = async function(tokens){
  const Classes = await getClasses(tokens)
  //console.log(Classes)
  Classes.forEach(async (Class) => {
    const Teachers = await getTeachers(tokens, Class.id)
    Teachers.forEach(teacher => {
      //console.log(teacher)
      let userId = teacher.userId
      let name = teacher.profile.name.fullName
      IdListDB.addIdList(userId,'Teacher',name)
    })
    const Students = await getStudents(tokens, Class.id)
    Students.forEach(student => {
      //console.log(student)
      let userId = student.userId
      let name = student.profile.name.fullName
      IdListDB.addIdList(userId,'Student',name)
    })
  });
}

module.exports = Idlist