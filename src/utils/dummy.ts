import Item from "../models/item";
import User from "../models/user";
import Project from "../models/project";
import Event from "../models/event";
import Resources from "../models/resources";
// import { Document } from "mongoose";

const resources = [
  {
    internal_name: "Something",
    directory_year: "Again Something",
    subdirectory: "something something",
    name: "Shashwat Human Resource",
    archive: true,
    description: "Yo yo",
    url: "http://shashwat.com",
    new: true,
    displayOnWebsite: true,
    created_by: 0,
    updated_by: 0

  }
];

const users = [
  {
    email: "suyash1212@gmail.com",
    name: "Suyash Agrawal",
    entryNumber: "2015Cs10262",
    hostel: "Kumaon",
    password: "1234",
    gender: "male",
    joinYear: new Date(),
    gradYear: new Date(),
    birthDate: new Date(),
    mobileNumber: "+919757866783",
    hometown: "Satna",
    interests: "Satna",
    specialization: "Satna",
    intro: "Satna",
    displayOnWebsite: true,
    links: {
      "github": "hahahahahaha",
      "photo": "hahahahahaha"
    },
    privelege_level: "Approved_User"
  },
  {
    email: "aman71197@gmail.com",
    name: "Aman Agrawal",
    password: "1234",
    entryNumber: "2015Cs10210",
    hostel: "Kumaon",
    gender: "male",
    joinYear: new Date(),
    gradYear: new Date(),
    birthDate: new Date(),
    mobileNumber: "+919988776549",
    hometown: "Satna",
    interests: "Satna",
    specialization: "Satna",
    intro: "Satna",
    displayOnWebsite: true,
    links: {
      "github": "kol",
      "photo": "kol"
    },
    privelege_level: "Approved_User"
  },
  {
    email: "lol@gmail.com",
    name: "LOLO",
    password: "1234",
    entryNumber: "2015Cs10292",
    hostel: "Aravali",
    gender: "female",
    joinYear: new Date(),
    gradYear: new Date(),
    birthDate: new Date(),
    mobileNumber: "+919017955555",
    hometown: "Satna",
    interests: "Satna",
    specialization: "Satna",
    intro: "Satna",
    displayOnWebsite: false,
    links: {
      "github": "lol",
      "photo": "lol"
    },
    privelege_level: "Admin"
  }
];

const projects = [
  {
    name: "FileSend",
    description: "FileSend",
    members: [0,1],
    status: "IDEA",
    startDate: new Date(),
    endDate: new Date(),
    origin: "self",
    origin_contact: "989898989",
    perks: "no perks",
    requirements: "it should work",
    displayOnWebsite: true,
    isInternal: false,
    links: {
      url: "fs.devclub.in"
    },
    created_by: 0,
    updated_by: 0
  },
  {
    name: "Citadel",
    description: "Citadel",
    members: [0,2],
    status: "DOING",
    startDate: new Date(),
    endDate: new Date(),
    origin: "self",
    origin_contact: "6654654",
    perks: "no perks",
    requirements: "it should work",
    displayOnWebsite: true,
    isInternal: true,
    links: {
      url: "study.devclub.in"
    },
    created_by: 0,
    updated_by: 0
  }
];

const events = [
  {
    name: "Introduction",
    description: "intro to devclub",
    startDate: new Date(),
    endDate: new Date(),
    displayOnWebsite: true,
    links: {
      url: "intro.devclub.in"
    },
    assignee: "Atishya",
    created_by: 0,
    updated_by: 0
  }
];

const items = [
  {
    parentId: 0,
    title: "Book Room",
    description: "Book LH108",
    type: "event",
    dueDate: new Date(),
    assignee: [2],
    status: "IDEA",
    labels: ["Working","Important"],
    completed: false,
    created_by: 0,
    updated_by: 0
  },
  {
    parentId: 0,
    title: "Create Poster",
    description: "Create dashiing poster",
    type: "event",
    labels: ["Done"],
    assignee: [0],
    status: "IDEA",
    dueDate: new Date(),
    completed: true,
    created_by: 0,
    updated_by: 0
  },
  {
    parentId: 0,
    title: "Design Doc",
    description: "Create Design doc",
    type: "project",
    labels: ["Working"],
    assignee: [1],
    status: "IDEA",
    dueDate: new Date(),
    completed: false,
    created_by: 0,
    updated_by: 0
  },
  {
    parentId: 0,
    title: "Implement",
    description: "Finish up",
    type: "resource",
    labels: ["Working"],
    assignee: [0, 1, 2],
    status:"IDEA",
    dueDate: new Date(),
    completed: false,
    created_by: 0,
    updated_by: 0
  }
];

const createDummyData = () => {
  return User.create(users)
    .then((createdUsers) => {
      for (let i = 0; i < projects.length; i++) {
        const memIds = [];
        for (let j = 0; j < projects[i].members.length; j++) {
          memIds.push(createdUsers[projects[i].members[j]].id);
        }
        projects[i].members = memIds;
        if (projects[i].created_by != undefined) {
          projects[i].created_by = createdUsers[projects[i].created_by].id;
        }
        if (projects[i].updated_by != undefined) {
          projects[i].updated_by = createdUsers[projects[i].updated_by].id;
        }
      }
      return Project.create(projects)
        .then((createdProjects) => {
          for (let i = 0; i < events.length; i++) {
            if (events[i].created_by != undefined) {
              events[i].created_by = createdUsers[events[i].created_by].id;
            }
            if (resources[i].updated_by != undefined) {      
              events[i].updated_by = createdUsers[events[i].updated_by].id;
            }
          }
          return Event.create(events)
            .then(createdEvents => {
              for (let i = 0; i < resources.length; i++) {
                if (resources[i].created_by != undefined) {
                  resources[i].created_by = createdUsers[resources[i].created_by].id;
                }
                if (resources[i].updated_by != undefined) {
                  resources[i].updated_by = createdUsers[resources[i].updated_by].id;
                }
              }
              return Resources.create(resources)
                .then(createdResources => {
                  for (let i = 0; i < items.length; i++) {
                    const idx: number = (items[i].parentId as number);
                    if (items[i].type == "event") {
                      items[i].parentId = createdEvents[idx].id;
                    } else if (items[i].type == "resource") {
                      items[i].parentId = createdResources[idx].id;
                    } else {
                      items[i].parentId = createdProjects[idx].id;
                    }
                    const memIds = [];
                    for (let j = 0; j < items[i].assignee.length; j++) {
                      memIds.push(createdUsers[items[i].assignee[j]].id);
                    }
                    items[i].assignee = memIds;
                    if (items[i].created_by != undefined) {
                      items[i].created_by = createdUsers[items[i].created_by].id;
                    }
                    if (items[i].updated_by != undefined) {
                      items[i].updated_by = createdUsers[items[i].updated_by].id;
                    }
                  }
                  return Item.create(items)
                    .then(x => [x, createdResources, createdUsers, createdProjects, createdEvents]);
                });
            });
        });
    })
    .catch((err) => {
      return err;
    });
};

export default createDummyData;