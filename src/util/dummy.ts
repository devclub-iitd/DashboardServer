import item, {default as Item} from "../models/item";
import {default as User} from "../models/user";
import {default as Project} from "../models/project";
import {default as Event} from "../models/event";
import {Document} from "mongoose";

const users = [
    {
        email: "suyash1212@gmail.com",
        name: "Suyash Agrawal",
        entryNumber: "2015Cs10262",
        hostel: "Kumaon",
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
        }
    },
    {
        email: "aman71197@gmail.com",
        name: "Aman Agrawal",
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
        }
    },
    {
        email: "lol@gmail.com",
        name: "LOLO",
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
        }
    }
];

const projects = [
    {
        name: "FileSend",
        description: "FileSend",
        members: [0,1],
        startDate: new Date(),
        endDate: new Date(),
        origin: "self",
        perks: "no perks",
        requirements: "it should work",
        displayOnWebsite: true,
        isInternal: false,
        links: {
            url: "fs.devclub.in"
        }
    },
    {
        name: "Citadel",
        description: "Citadel",
        members: [0,2],
        startDate: new Date(),
        endDate: new Date(),
        origin: "self",
        perks: "no perks",
        requirements: "it should work",
        displayOnWebsite: true,
        isInternal: true,
        links: {
            url: "study.devclub.in"
        }
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
        }
    }
];

const items = [
    {
        parentId: ["events",0],
        title: "Book Room",
        description: "Book LH108",
        type: "event",
        labels: ["Working","Important"],
        assignee: [2],
        dueDate: new Date(),
        completed: false
    },
    {
        parentId: ["events",0],
        title: "Create Poster",
        description: "Create dashiing poster",
        type: "event",
        labels: ["Done"],
        assignee: [0],
        dueDate: new Date(),
        completed: true
    },
    {
        parentId: ["projects",0],
        title: "Design Doc",
        description: "Create Design doc",
        type: "project",
        labels: ["Working"],
        assignee: [1],
        dueDate: new Date(),
        completed: false
    },
    {
        parentId: ["projects",1],
        title: "Implement",
        description: "Finish up",
        type: "project",
        labels: ["Working"],
        assignee: [0,1,2],
        dueDate: new Date(),
        completed: false
    }
];

export const createDummyData = () => {
    return User.create(users)
    .then((createdUsers)=>{
        for(let i=0;i<projects.length;i++) {
            const memIds = [];
            for(let j=0;j<projects[i].members.length;j++) {
                memIds.push(createdUsers[projects[i].members[j]].id);
            }
            projects[i].members = memIds;
        }
        return Project.create(projects)
        .then((createdProjects)=>{
            return [createdProjects,createdUsers];
        });
    })
    .then(([createdProjects,createdUsers])=>{
        return Event.create(events)
        .then(createdEvents => [createdEvents,createdProjects,createdUsers]);
    })
    .then(([createdEvents,createdProjects,createdUsers])=>{
        for(let i=0;i<items.length;i++) {
            let idx:number = (items[i].parentId[1] as number);
            if(items[i].parentId[0]=="events") {
                items[i].parentId = createdEvents[idx].id;
            } else {
                items[i].parentId = createdProjects[idx].id;
            }
            const memIds = [];
            for(let j=0;j<items[i].assignee.length;j++) {
                memIds.push(createdUsers[items[i].assignee[j]].id);
            }
            items[i].assignee = memIds;
        }
        return Item.create(items).then(x=>[x,createdEvents,createdProjects,createdUsers]);
    });
}