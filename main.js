/*
 * Copyright (c) 2014 MKLab. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, regexp: true */
/*global define, $, _, window, app, type, appshell, document */

define(function (require, exports, module) {
    "use strict";

    var AppInit = app.getModule("utils/AppInit"),
        Repository = app.getModule("core/Repository"),
        Engine = app.getModule("engine/Engine"),
        Commands = app.getModule("command/Commands"),
        CommandManager = app.getModule("command/CommandManager"),
        MenuManager = app.getModule("menu/MenuManager"),
        Dialogs = app.getModule("dialogs/Dialogs"),
        ElementPickerDialog = app.getModule("dialogs/ElementPickerDialog"),
        FileSystem = app.getModule("filesystem/FileSystem"),
        FileSystemError = app.getModule("filesystem/FileSystemError"),
        ExtensionUtils = app.getModule("utils/ExtensionUtils"),
        UML = app.getModule("uml/UML");

    var CodeGenUtils = require("CodeGenUtils"),
        TypeScriptPreferences = require("TypeScriptPreferences"),
        TypeScriptCodeGenerator = require("TypeScriptCodeGenerator"),
        TypeScriptReverseEngineer = require("TypeScriptReverseEngineer");

    /**
     * Commands IDs
     */
    var CMD_TYPESCRIPT = "typescript",
        CMD_TYPESCRIPT_GENERATE = "typescript.generate",
        CMD_TYPESCRIPT_REVERSE = "typescript.reverse",
        CMD_TYPESCRIPT_CONFIGURE = "typescript.configure";

    /**
     * Command Handler for TypeScript Generate
     *
     * @param {Element} base
     * @param {string} path
     * @param {Object} options
     * @return {$.Promise}
     */
    function _handleGenerate(base, path, options) {
        var result = new $.Deferred();

        // If options is not passed, get from preference
        options = options || TypeScriptPreferences.getGenOptions();

        // If base is not assigned, popup ElementPicker
        if (!base) {
            ElementPickerDialog.showDialog("Select a base model to generate codes", null, type.UMLPackage)
                .done(function (buttonId, selected) {
                    if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                        base = selected;

                        // If path is not assigned, popup Open Dialog to select a folder
                        if (!path) {
                            FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                                if (!err) {
                                    if (files.length > 0) {
                                        path = files[0];
                                        TypeScriptCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                                    } else {
                                        result.reject(FileSystem.USER_CANCELED);
                                    }
                                } else {
                                    result.reject(err);
                                }
                            });
                        } else {
                            TypeScriptCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                        }
                    } else {
                        result.reject();
                    }
                });
        } else {
            // If path is not assigned, popup Open Dialog to select a folder
            if (!path) {
                FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                    if (!err) {
                        if (files.length > 0) {
                            path = files[0];
                            TypeScriptCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
                        } else {
                            result.reject(FileSystem.USER_CANCELED);
                        }
                    } else {
                        result.reject(err);
                    }
                });
            } else {
                TypeScriptCodeGenerator.generate(base, path, options).then(result.resolve, result.reject);
            }
        }
        return result.promise();
    }


    /**
     * Command Handler for TypeScript Reverse
     *
     * @param {string} basePath
     * @param {Object} options
     * @return {$.Promise}
     */
    function _handleReverse(basePath, options) {
        var result = new $.Deferred();

        // If options is not passed, get from preference
        options = TypeScriptPreferences.getRevOptions();

        // If basePath is not assigned, popup Open Dialog to select a folder
        if (!basePath) {
            FileSystem.showOpenDialog(false, true, "Select Folder", null, null, function (err, files) {
                if (!err) {
                    if (files.length > 0) {
                        basePath = files[0];
                        TypeScriptReverseEngineer.analyze(basePath, options).then(result.resolve, result.reject);
                    } else {
                        result.reject(FileSystem.USER_CANCELED);
                    }
                } else {
                    result.reject(err);
                }
            });
        }
        return result.promise();
    }

    function _handleConfigure() {
        CommandManager.execute(Commands.FILE_PREFERENCES, TypeScriptPreferences.getId());
    }

    // Register Commands
    CommandManager.register("TypeScript", CMD_TYPESCRIPT, CommandManager.doNothing);
    CommandManager.register("Generate Code...", CMD_TYPESCRIPT_GENERATE, _handleGenerate);
    CommandManager.register("Reverse Code...", CMD_TYPESCRIPT_REVERSE, _handleReverse);
    CommandManager.register("Configure...", CMD_TYPESCRIPT_CONFIGURE, _handleConfigure);

    var menu, menuItem;
    menu = MenuManager.getMenu(Commands.TOOLS);
    menuItem = menu.addMenuItem(CMD_TYPESCRIPT);
    menuItem.addMenuItem(CMD_TYPESCRIPT_GENERATE);
    menuItem.addMenuItem(CMD_TYPESCRIPT_REVERSE);
    menuItem.addMenuDivider();
    menuItem.addMenuItem(CMD_TYPESCRIPT_CONFIGURE);
});
