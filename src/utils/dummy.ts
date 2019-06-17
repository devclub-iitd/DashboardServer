import item, { default as Item } from "../models/item";
import { default as User } from "../models/user";
import { default as Project } from "../models/project";
import { default as Event } from "../models/event";
import { default as Resources } from "../models/resources";
import { Document } from "mongoose";

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
        },
        privelege_level: "Approved_User"
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
        },
        privelege_level: "Approved_User"
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
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
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
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
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
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
    }
];

const items = [
    {
        parentId: ["events",0],
        title: "Book Room",
        description: "Book LH108",
        type: "event",
        dueDate: new Date(),
        assignee: [2],
        labels: ["Working","Important"],
        completed: false,
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
    },
    {
        parentId: ["events",0],
        title: "Create Poster",
        description: "Create dashiing poster",
        type: "event",
        labels: ["Done"],
        assignee: [0],
        dueDate: new Date(),
        completed: true,
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
    },
    {
        parentId: ["projects",0],
        title: "Design Doc",
        description: "Create Design doc",
        type: "project",
        labels: ["Working"],
        assignee: [1],
        dueDate: new Date(),
        completed: false,
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
    },
    {
        parentId: ["projects", 1],
        title: "Implement",
        description: "Finish up",
        type: "project",
        labels: ["Working"],
        assignee: [0, 1, 2],
        dueDate: new Date(),
        completed: false,
        create_date: new Date(),
        created_by: "Atishya",
        update_date: new Date(),
        updated_by: "Atishya"
    }
];

export const createDummyData = () => {
    return User.create(users)
    .then((createdUsers) => {
        for (let i = 0; i < projects.length; i++) {
            const memIds = [];
            for (let j = 0; j < projects[i].members.length; j++) {
                memIds.push(createdUsers[projects[i].members[j]].id);
            }
            projects[i].members = memIds;
        }
        return Project.create(projects)
        .then((createdProjects) => {
            return [createdProjects, createdUsers];
        });
    })
    .then(([createdProjects, createdUsers]) => {
        return Event.create(events)
        .then(createdEvents => [createdEvents, createdProjects, createdUsers]);
    })
    .then(([createdEvents, createdProjects, createdUsers]) => {
        for (let i = 0; i < items.length; i++) {
            const idx: number = (items[i].parentId[1] as number);
            if (items[i].parentId[0] == "events") {
                items[i].parentId = createdEvents[idx].id;
            } else {
                items[i].parentId = createdProjects[idx].id;
            }
            const memIds = [];
            for (let j = 0; j < items[i].assignee.length; j++) {
                memIds.push(createdUsers[items[i].assignee[j]].id);
            }
            items[i].assignee = memIds;
        }
        return Item.create(items).then(x => [x, createdEvents, createdProjects, createdUsers]);
    });
};