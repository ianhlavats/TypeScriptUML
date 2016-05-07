/*
 * Copyright (c) 2013-2014 Minkyu Lee. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains the
 * property of Minkyu Lee. The intellectual and technical concepts
 * contained herein are proprietary to Minkyu Lee and may be covered
 * by Republic of Korea and Foreign Patents, patents in process,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Minkyu Lee (niklaus.lee@gmail.com).
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, $, _, window, appshell, app */

define(function (require, exports, module) {
    "use strict";

    var AppInit           = app.getModule("utils/AppInit"),
        Core              = app.getModule("core/Core"),
        PreferenceManager = app.getModule("core/PreferenceManager");

    var preferenceId = "typescript";

    var typescriptPreferences = {
        "typescript.gen": {
            text: "TypeScript Code Generation",
            type: "Section"
        },
        "typescript.gen.typescriptDoc": {
            text: "TypeScript Doc",
            description: "Generate TypeScript Doc comments.",
            type: "Check",
            default: true
        },
        "typescript.gen.useTab": {
            text: "Use Tab",
            description: "Use Tab for indentation instead of spaces.",
            type: "Check",
            default: false
        },
        "typescript.gen.indentSpaces": {
            text: "Indent Spaces",
            description: "Number of spaces for indentation.",
            type: "Number",
            default: 4
        },
        "typescript.rev": {
            text: "TypeScript Reverse Engineering",
            type: "Section"
        },
        "typescript.rev.association": {
            text: "Use Association",
            description: "Reverse TypeScript Fields as UML Associations.",
            type: "Check",
            default: true
        },
        "typescript.rev.publicOnly": {
            text: "Public Only",
            description: "Reverse public members only.",
            type: "Check",
            default: false
        },
        "typescript.rev.typeHierarchy": {
            text: "Type Hierarchy Diagram",
            description: "Create a type hierarchy diagram for all classes and interfaces",
            type: "Check",
            default: true
        },
        "typescript.rev.packageOverview": {
            text: "Package Overview Diagram",
            description: "Create overview diagram for each package",
            type: "Check",
            default: true
        },
        "typescript.rev.packageStructure": {
            text: "Package Structure Diagram",
            description: "Create a package structure diagram for all packages",
            type: "Check",
            default: true
        }
    };

    function getId() {
        return preferenceId;
    }

    function getGenOptions() {
        return {
            typescriptDoc     : PreferenceManager.get("typescript.gen.typescriptDoc"),
            useTab        : PreferenceManager.get("typescript.gen.useTab"),
            indentSpaces  : PreferenceManager.get("typescript.gen.indentSpaces")
        };
    }

    function getRevOptions() {
        return {
            association      : PreferenceManager.get("typescript.rev.association"),
            publicOnly       : PreferenceManager.get("typescript.rev.publicOnly"),
            typeHierarchy    : PreferenceManager.get("typescript.rev.typeHierarchy"),
            packageOverview  : PreferenceManager.get("typescript.rev.packageOverview"),
            packageStructure : PreferenceManager.get("typescript.rev.packageStructure")
        };
    }

    AppInit.htmlReady(function () {
        PreferenceManager.register(preferenceId, "TypeScript", typescriptPreferences);
    });

    exports.getId         = getId;
    exports.getGenOptions = getGenOptions;
    exports.getRevOptions = getRevOptions;

});
