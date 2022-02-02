import { v4 as uuid } from "uuid"

const fs = require("fs")
let users = require("data/users.json")

export const usersRepo = {
  getAll,
  updateItems,
}

function getAll() {
  return users
}

function updateItems(id, { email, value, isprivate, itemsid }) {
  const user = users.find((x) => x.email === email)
  const item = {
    id: itemsid ? itemsid : uuid() ,
    value: value,
    isprivate: isprivate,
    dateCreated:new Date().toISOString()
  }
  // splicing the data
  if (itemsid) {
    if (isprivate) {
      const userData = [];
      users.map((user) => {
        user.publicItems.forEach((items) => {
          if (items.id === itemsid) {
            userData.push(user);
          }
        })
      })
      const index = userData[0].publicItems.findIndex((user) => user.id === itemsid);
      if (index !== -1) userData[0].publicItems.splice(index, 1);

    } else {
      const userData = [];
      users.map((user) => {
        user.privateItems.forEach((items) => {
          if (items.id === itemsid) {
            userData.push(user);
          }
        })
      })
      const index = userData[0].privateItems.findIndex((user) => user.id === itemsid);
      if (index !== -1) userData[0].privateItems.splice(index, 1);
    }
  }
   if (isprivate) {
       user.privateItems.push(item)
   }else{
       user.publicItems.push(item)
   }
 // save data
  saveData()
}

// private helper functions

function saveData() {
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, 4))
}
