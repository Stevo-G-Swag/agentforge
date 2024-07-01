"use strict";

class Project {
    constructor(name, description) {
        if (typeof name !== "string" || typeof description !== "string") {
            throw new Error("Name and description must be strings");
        }
        this._name = name;
        this._description = description;
        // Add any other properties you need for your project
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (typeof value !== "string") {
            throw new Error("Name must be a string");
        }
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        if (typeof value !== "string") {
            throw new Error("Description must be a string");
        }
        this._description = value;
    }

    // Add methods and functionality specific to your project

    // Example method:
    start() {
        console.log(`Starting project: ${this.name}`);
        // Add your project's startup logic here
    }
}

module.exports = Project;